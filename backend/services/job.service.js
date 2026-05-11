import mongoose from "mongoose";

import { AppError } from "../utils/AppError.js";

import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

export const createJobService = async ( data, userId ) => {
    const {
        title,
        description,
        requirements,
        requiredSkills,
        requiredLevels,
        salary,
        duration,
        jobType,
        quantity,
        benefit, 
        companyId
    } = data;
    // validate
    if ( 
        !title || !description || !requirements || !salary || 
        !requiredSkills || !requiredLevels || !duration || 
        !jobType || !quantity || !benefit || !companyId 
    ) {
        throw new AppError("Vui lòng nhập đầy đủ các thông tin.", 400);
    } ;

    const job = Job.create({
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
    });

    return job;
};

export const getAllJobsService = async ( queryParams ) => {
    const keyword = (queryParams.keyword || "").trim();
    const skillIds = queryParams.skills?.split(',').filter(id => id) || [];
    const levelIds = queryParams.levels?.split(',').filter(id => id) || [];
    const location = (queryParams.location || "").trim();
    
    const pageNum = parseInt(queryParams.page, 10) || 1;
    const limitNum = parseInt(queryParams.limit, 10) || 20;

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
    };

    if (location && companyLocationIds.length > 0) {
      query.$and.push({ company: { $in: companyLocationIds } });
    };
    if (skillIds.length > 0) {
        query.$and.push({
            requiredSkills: {
                $all: skillIds.map(id => new mongoose.Types.ObjectId(id))
            }
        });
    }
    if (levelIds.length > 0) {
      query.$and.push({ requiredLevels: { $in: levelIds } });
    };
    // filter chưa hết hạn
    query.$and.push({
        duration: { $gte: new Date() }
    });

    if (query.$and.length === 0) {
        delete query.$and;
    };
    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
        .populate("company")
        .populate("requiredSkills")
        .populate("requiredLevels")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .sort({ createdAt: -1 });

    return {
        jobs,
        totalJobs,
        currentPage: pageNum,
        totalPages: Math.ceil(totalJobs / limitNum)
    };
};

export const deleteJobService = async (jobId, userId) => {

    const job = await Job.findById(jobId);

    if (!job) {
        throw new AppError("Không tìm thấy công việc.", 404);
    }

    if (!job.created_by.equals(userId)) {
        throw new AppError("Không có quyền xoá công việc này.", 403);
    }

    await Application.deleteMany({ job: jobId });

    await job.deleteOne();

    const updatedJobs = await Job.find({ created_by: userId }).lean();

    return {
        deletedJobId: jobId,
        updatedJobs
    };
};

export const updateJobService = async (data, jobId, userId) => {
    
    const { 
        title,
        description,
        requirements,
        requiredSkills,
        requiredLevels,
        salary,
        jobType,
        quantity,
        benefit,
        duration
    } =data;
    
    if(
        !title || !description || !requirements || 
        !salary || !requiredSkills || !requiredLevels || 
        !duration || !jobType || !quantity || !benefit 
    ){
        throw new AppError("Vui lòng nhập đầy đủ các thông tin.", 400);
    };

    const job = await Job.findById(jobId);

    if (!job) {
        throw new AppError("Không tìm thấy công việc.", 404);
    }

    if (!job.created_by.equals(userId)) {
        throw new AppError("Không có quyền xoá công việc này.", 403);
    }

    Object.assign(job, {
        title,
        description,
        requirements,
        requiredSkills,
        requiredLevels,
        salary,
        jobType,
        quantity,
        benefit,
        duration
    });

    await job.save();

    return job;
};