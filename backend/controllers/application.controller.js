import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { emitNotification } from "../utils/emitNotification.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const user = await User.findById(userId);
    if (!userId) {
      return res.status(400).json({
        message: "Vui lòng đăng nhập vào GeekJobs!",
        success: false
      });
    }

    if(!user.cvId) {
      return res.status(400).json({
        message: "Bạn chưa có CV để ứng tuyển công việc này.",
        success: false
      });
    }

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID không hợp lệ.",
        success: false
      });
    }

    const existingApplication = await Application.find({
      job: jobId,
      applicant: userId
    });

    if (existingApplication.length > 0) {
      return res.status(400).json({
        message: "Bạn đã nộp đơn xin việc này rồi.",
        success: false
      });
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({
        message: "Không tìm thấy công việc.",
        success: false
      });
    }

    if (!job.company) {
      return res.status(404).json({
        message: "Công ty không tồn tại.",
        success: false
      });
    }

    if (!job.requiredLevels.some(level => level.equals(user.profile.level))) {
      return res.status(400).json({
        message: "Bạn chưa đạt yêu cầu về trình độ để ứng tuyển công việc này.",
        success: false
      });
    }

    const companyId = job.company._id;
    const employerId = job.created_by;

    const newApplication = await Application.create({
      job: jobId,
      company: companyId,
      applicant: userId
    });

    job.applications.push(newApplication._id);
    await job.save();

    const notification = await Notification.create({
      recipient: employerId,
      sender: userId,
      type: 'Ứng tuyển',
      message: `Ứng viên vừa ứng tuyển công việc: ${job.title}`,
      relatedJob: jobId,
      isRead: false,
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    emitNotification(io, onlineUsers, employerId, {
      ...notification._doc,
      message: `Ứng viên vừa ứng tuyển công việc: ${job.title}`,
    });

    return res.status(201).json({
      message: "Việc làm đã được ứng tuyển thành công",
      success: true
    });

  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi ứng tuyển công việc.",
      success: false
    });
  }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant: userId}).sort({createdAt: -1}).populate({
            path: 'job',
            options: {sort:{createdAt: -1}},
            populate: {
                path: 'company',
                options: {sort:{createdAt: -1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message: "Không có ứng tuyển.",
                success: false
            });
        }

        return res.status(200).json({
            application, 
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

//employer
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job =  await Job.findById(jobId).populate({
            path: 'applications',
            options: {sort:{createdAt: -1}},
            populate: { path: 'applicant', options: {sort:{createdAt: -1}}}
        });
        if(!job){
            return res.status(404).json({
                message: "Không tìm thấy công việc.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

export const getAllApplicants = async (req, res) => {
  try {
    const employerId = req.user.id;
    const jobs = await Job.find({ created_by: employerId }).select('_id');

    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate('job')
      .populate('applicant');

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const updateStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status) {
            return res.status(400).json({
                message: "Bắt buộc.",
                success: false
            });
        }
        const application = await Application.findOne({_id: applicationId});
        if(!application) {
            return res.status(404).json({
                message: "Không tìm thấy tuyển dụng.",
                success: false
            });
        }

        const jobId = application.job;
        const job = await Job.findById(jobId);
        if (!job) {
          return res.status(404).json({
            message: "Không tìm thấy công việc.",
            success: false
          });
        }

        const applicantId = application.applicant;
        const employerId = job.created_by;


        application.status = status;
        await application.save();

        const notification = await Notification.create({
          recipient: applicantId,
          sender: employerId,
          type: application.status,
          message: `Công việc ${job.title} của bạn ứng tuyển ${application.status}`,
          relatedJob: jobId,
          isRead: false,
        });

        const io = req.app.get("io");
        io.emit("application_status_updated", {
          applicationId: application._id,
          status: application.status,
        });
        const onlineUsers = req.app.get("onlineUsers");

        emitNotification(io, onlineUsers, applicantId, {
          ...notification._doc,
          message: `Công việc ${job.title} của bạn ứng tuyển ${application.status}`,
        });

        return res.status(200).json({
            message: "Trạng thái cập nhập thành công.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

export const setInterview = async (req, res) => {
  try {
    const { interviewDate } = req.body;
    const applicationId = req.params.id;

    if (!interviewDate) {
      return res.status(400).json({
        message: "Thiếu ngày phỏng vấn.",
        success: false
      });
    }

    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Không tìm thấy tuyển dụng.",
        success: false
      });
    }

    const jobId = application.job;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Không tìm thấy công việc.",
        success: false
      });
    }

    const applicantId = application.applicant;
    const employerId = job.created_by;

    application.interviewDate = interviewDate;
    await application.save();

    const date = new Date(application.interviewDate);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${
                              (date.getMonth() + 1).toString().padStart(2, '0')
                            }/${date.getFullYear()} - ${
                              date.getHours().toString().padStart(2, '0')
                            }:${date.getMinutes().toString().padStart(2, '0')}`;

    const notification = await Notification.create({
      recipient: applicantId,
      sender: employerId,
      type: "Phỏng vấn",
      message: `Công việc "${job.title}" bạn ứng tuyển đã được lên lịch phỏng vấn vào ${formattedDate}`,
      relatedJob: jobId,
      isRead: false,
    });

    const io = req.app.get("io");
    io.emit("interview_date_updated", {
      applicationId: application._id,
      interviewDate: application.interviewDate,
    });
    const onlineUsers = req.app.get("onlineUsers");

    emitNotification(io, onlineUsers, applicantId, {
      ...notification._doc,
      message: `Công việc "${job.title}" bạn ứng tuyển đã được lên lịch phỏng vấn vào ${formattedDate}`,
    });

    return res.status(200).json({
      message: "Đã lên lịch phỏng vấn.",
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi lên lịch phỏng vấn.",
      success: false
    });
  }
};

export const deleteApplicant = async (req, res) => {
    try {
        const applicantId = req.params.id;
        const applicant = await Application.findByIdAndDelete(applicantId);
        if(!applicant) {
          return res.status(400).json({
            message: "Không tìm thấy ứng viên.",
            success:false
          })
        }

        await Job.findByIdAndUpdate(applicant.job, {
            $pull: { applications: applicantId }
        });

        const io = req.app.get("io");
        io.emit("applicant_deleted", applicantId);

        return res.status(200).json({
            message: "Ứng viên đã được xoá thành công.",
            success: true,
            applicant
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi xoá công việc.",
            success: false
        });
    }
};

