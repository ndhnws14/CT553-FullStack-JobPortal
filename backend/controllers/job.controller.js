import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";

//admin
export const postJob = async (req, res) => {
    try {
        const {title, description, requirements, requiredSkills, requiredLevels, salary, duration, jobType, quantity, benefit, companyId} = req.body;
        const userId = req.id;
        if(!title || !description || !requirements || !salary || !requiredSkills || !requiredLevels || !duration || !jobType || !quantity || !benefit || !companyId){
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ các thông tin.",
                success: false
            })
        }
        const job = await Job.create({
            title,
            description,
            requirements,
            requiredSkills,
            requiredLevels,
            salary,
            duration,
            jobType,
            quantity: Number(quantity),
            benefit,
            company: companyId,
            created_by: userId
        })
        
        const io = req.app.get('io');
        io.emit("job_post", job);

        return res.status(201).json({
            message: "Tạo công việc mới thành công.",
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi tạo công việc.",
            success: false,
            error: error.message
        });
    }
}

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

export const updateJob = async (req, res) => {
    try {
        const { title, description, requirements, requiredSkills, requiredLevels, salary, jobType, quantity, benefit, duration } =req.body;
         if(!title || !description || !requirements || !salary || !requiredSkills || !requiredLevels || !duration || !jobType || !quantity || !benefit ){
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ các thông tin.",
                success: false
            })
        }
        const updateData = { title, description, requirements, requiredSkills, requiredLevels, salary, duration, jobType, quantity, benefit };
        
        const job = await Job.findByIdAndUpdate(req.params.id, updateData, {new:true});
        
        if(!job){
            return res.status(404).json({
                message: "Không tìm thấy công việc.",
                success: false
            });
        };

        const io = req.app.get('io');
        io.emit("job_updated", job);
        
        return res.status(200).json({
            message: "Công việc đã được cập nhật.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi cập công việc.",
            success: false,
            error: error.message
        });
    }
}

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        await Application.deleteMany({ job: jobId });
        
        const job = await Job.findByIdAndDelete(jobId);
        
        if(!job) {
            return res.status(404).json({
                message: "Không tìm thấy công việc.",
                success: false
            });
        }

        const io = req.app.get('io');
        io.emit("job_deleted", jobId);
        
        const updatedJobs = await Job.find({ created_by: req.id });
        return res.status(200).json({
            message: "Công việc đã được xoá thành công.",
            success: true,
            jobs: updatedJobs
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi xoá công việc.",
            success: false
        });
    }
}
//Nguoi tim viec
export const getAllJobs = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const location = (req.query.location || "").trim();
    const skillIds = req.query.skills?.split(',').filter(id => id) || [];
    const levelIds = req.query.levels?.split(',').filter(id => id) || [];
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    let companyLocationIds = [];
    if (location) {
      const locationList = location.split(',').filter(loc => loc);
      const companiesByLocation = await Company.find({
        $or: locationList.map(loc => ({
          location: { $regex: new RegExp(`^${loc}$`, 'i') }
        }))
      });
      companyLocationIds = companiesByLocation.map(c => c._id);
    }

    let companyKeywordIds = [];
    if (keyword) {
      const companiesByKeyword = await Company.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { abbreviationName: { $regex: keyword, $options: "i" } }
        ]
      });
      companyKeywordIds = companiesByKeyword.map(c => c._id);
    }

    const query = { $and: [] };

    if (keyword) {
      query.$and.push({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { requirements: { $regex: keyword, $options: "i" } },
          { address: { $regex: keyword, $options: "i" } },
          { company: { $in: companyKeywordIds } }
        ]
      });
    }

    if (location && companyLocationIds.length > 0) {
      query.$and.push({ company: { $in: companyLocationIds } });
    }

    if (skillIds.length > 0) {
      query.$and.push({ requiredSkills: { $all: skillIds } });
    }

    if (levelIds.length > 0) {
      query.$and.push({ requiredLevels: { $in: levelIds } });
    }

    // ✅ Thêm điều kiện lọc job chưa hết hạn
    query.$and.push({
      $or: [
        { duration: { $exists: false } },        // Nếu không có trường duration
        { duration: { $gte: new Date() } }       // Hoặc còn hạn
      ]
    });

    if (query.$and.length === 0) {
      delete query.$and;
    }

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate("company")
      .populate("requiredSkills")
      .populate("requiredLevels")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
      totalJobs,
      currentPage: pageNum,
      totalPages: Math.ceil(totalJobs / limitNum),
    });

  } catch (error) {
    console.error("Lỗi khi tìm kiếm công việc:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

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