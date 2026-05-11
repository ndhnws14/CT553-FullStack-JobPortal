import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";

import { createJobService, deleteJobService, getAllJobsService, updateJobService } from "../services/job.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//admin
export const postJob = asyncHandler(async (req, res) => {
    const job = await createJobService(req.body, req.id);
    
    const io = req.app.get('io');
    io.emit("job_post", job);

    return res.status(201).json({
        message: "Tạo công việc mới thành công.",
        job,
        success: true
    });
});

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by: adminId}).populate({
            path: 'company'
        }).sort({ createdAt: -1 });;
        if(!jobs){
            return res.status(404).json({
                message: "Không tìm thấy công việc.",
                success: false
            })
        }
        
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAdminJobById = async (req, res) => {
    try {
        const adminId = req.id;
        const jobId = req.params.id;
        
        const admin = await User.findById(adminId);
        if(!admin){
            return res.status(404).json({
                message: "Không tìm thấy nhà tuyển dụng.",
                success: false
            });
        }
        
        const job = await Job.findById(jobId).populate('requiredSkills')
                                                .populate('requiredLevels');
        if(!job){
            return res.status(404).json({
                message: "Không tìm thấy công việc.",
                success: false
            })
        }
        
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateJob = asyncHandler( async (req, res) => {
    const job = await updateJobService(req.body, req.params.id, req.id);

    const io = req.app.get('io');
    io.emit("job_updated", job);
    
    return sendResponse(
        res,
        200,
        true,
        "Công việc đã được cập nhật.",
        job
    );
});

export const deleteJob = asyncHandler(async (req, res) => {

    const result = await deleteJobService(req.params.id, req.id);

    const io = req.app.get('io');
    io.emit("job_deleted", result.deletedJobId);

    return res.status(200).json({
        success: true,
        message: "Công việc đã được xoá thành công.",
        jobs: result.updatedJobs
    });
});
//Nguoi tim viec
export const getAllJobs = asyncHandler(async (req, res) => {
    const result = await getAllJobsService(req.query);

    return res.status(200).json({
        success: true,
        ...result
    });
});

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findByIdAndUpdate(jobId, { $inc: { views: 1 } }, { new: true })
                        .populate({ path: "applications" })
                        .populate({ path: "company" })
                        .populate({ path: "requiredSkills" })
                        .populate({ path: "requiredLevels" })
        if(!job){
            return res.status(404).json({
                message: "Không tìm thấy công việc.",
                success: false
            })
        }

        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi máy chủ.",
            success: false
        });
    }
}

export const getPopularJob = async (req, res) => {
    try {
    const jobs = await Job.find({})
      .sort({ view: -1 })
      .limit(8)
      .populate("company")
      .populate("requiredSkills")
      .lean();

    res.json(jobs);
  } catch (err) {
    console.error("Lỗi lấy job phổ biến:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}