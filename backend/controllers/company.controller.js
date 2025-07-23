import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

//admin
export const registerCompany = async (req, res) => {
    try {
        const {companyName} = req.body;
        if(!companyName){
            return res.status(400).json({
                message: "Tên công ty là bắt buộc.",
                success: false
            });
        }
        let company = await Company.findOne({name: companyName});
        if(company){
            return res.status(400).json({
                message: "Bạn không thể đăng ký công ty này.",
                success: false
            });
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        })

        return res.status(201).json({
            message: "Công ty đã được đăng kí.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({userId});
        if(!companies){
            return res.status(404).json({
                message: "Không tìm thấy công ty.",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

export const updateCompany = async (req, res) => {
    try {
        const {
            name,
            abbreviationName,
            description,
            website,
            location,
            address,
            email,
            hotline,
            field
        } = req.body;

        let logo, background;

        if (req.files) {
            if (req.files.logo) {
                const logoUri = getDataUri(req.files.logo[0]);
                const logoUpload = await cloudinary.uploader.upload(logoUri.content);
                logo = logoUpload.secure_url;
            }

            if (req.files.background) {
                const bgUri = getDataUri(req.files.background[0]);
                const bgUpload = await cloudinary.uploader.upload(bgUri.content);
                background = bgUpload.secure_url;
            }
        }

        const updateData = {
            name,
            abbreviationName,
            description,
            website,
            location,
            address,
            email,
            hotline,
            field
        };

        if (logo) updateData.logo = logo;
        if (background) updateData.background = background;
        
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Không tìm thấy công ty.",
                success: false
            });
        }

        const io = req.app.get('io');
        io.emit("company_updated", company);

        return res.status(200).json({
            message: "Công ty đã được cập nhật.",
            success: true,
            company,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi cập nhật công ty.",
            success: false,
            error: error.message
        });
    }
};

export const getCompanyByEmployer = async (req, res) => {
    try {
        const employerId = req.id;
        const companyId = req.params.id;

        const employer = await User.findById(employerId);
        if(!employer){
            return res.status(404).json({
                message: "Không tìm thấy nhà tuyển dụng.",
                success: false
            });
        }

        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({
                message: "Không tìm thấy công ty.",
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi máy chủ.",
            success: false
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Không tìm thấy công ty.",
                success: false
            });
        }

        await Application.deleteMany({ company });
        await Job.deleteMany({ company });
        await Company.findByIdAndDelete(companyId);

        const io = req.app.get('io');
        io.emit("company_deleted", companyId);

        return res.status(200).json({
            message: "Công ty, công việc và các ứng tuyển liên quan đã bị xóa.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi xóa công ty.",
            success: false,
            error: error.message
        });
    }
};

export const getAllCompany = async (req, res) => {
    try {
        const companies = await Company.find();

        const companiesWithCount = await Promise.all(
            companies.map(async (company) => {
                const count = await Job.countDocuments({ company: company._id });
                return { ...company._doc, jobCount: count };
            })
        );
        return res.status(200).json({
            companies: companiesWithCount,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi server",
            success: false
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findByIdAndUpdate(companyId, { $inc: { views: 1 } }, { new: true });
        if(!company){
            return res.status(404).json({
                message: "Không tìm thấy công ty.",
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi máy chủ.",
            success: false
        });
    }
};

export const getJobsByCompany = async (req, res) => {
    try {
      const companyId  = req.params.id;
  
      const jobs = await Job.find({ company: companyId }).populate({ path: "requiredSkills" });
      
      return res.status(200).json({
        success: true,
        jobs,
      });
    } catch (err) {
      console.error("Error getJobsByCompany:", err);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};