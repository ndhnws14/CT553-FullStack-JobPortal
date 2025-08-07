import mongoose from 'mongoose';
import { User } from "../models/user.model.js";
import { CV } from "../models/cv.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { validateCVData } from "../utils/cvValidator.js";

export const createCV = async (req, res) => {
  try {
    const userId = req.id;
    const file = req.file;

    let education = {};
    let experiences = [];
    let skillGroups = [];

    try {
      education = JSON.parse(req.body.education || "{}");
      experiences = JSON.parse(req.body.experiences || "[]");
      skillGroups = JSON.parse(req.body.skillGroups || "[]");
    } catch {
      return res.status(400).json({ message: "Dữ liệu JSON không hợp lệ.", success: false });
    }

    const {
      fullname,
      office,
      birthday,
      sex,
      email,
      phoneNumber,
      address,
      github,
      hobbies,
      target,
      certificate,
      template
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại!", success: false });
    }

    const validationMessage = validateCVData({
      fullname,
      office,
      birthday,
      sex,
      email,
      phoneNumber,
      address,
      github,
      hobbies,
      target,
      certificate,
      education,
      experiences,
      skillGroups
    });

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage, success: false });
    }

    if (!file) {
      return res.status(400).json({ message: "Vui lòng tải ảnh lên!", success: false });
    }

    let avatarUrl;
    try {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "auto",
        folder: "cvs",
        access_mode: "public"
      });
      avatarUrl = cloudResponse.secure_url;
    } catch {
      return res.status(500).json({ message: "Lỗi khi tải ảnh lên Cloudinary.", success: false });
    }

    const allowedTemplates = ['minimal', 'classic', 'modern', 'creative'];
    if (!allowedTemplates.includes(template)) {
      return res.status(400).json({ message: "Mẫu CV không hợp lệ.", success: false });
    }

    const cv = await CV.create({
      fullname,
      office,
      avatar: avatarUrl,
      birthday,
      sex,
      email,
      phoneNumber,
      address,
      github,
      hobbies,
      target,
      education,
      skillGroups,
      experiences,
      certificate,
      template,
      created_by: userId
    });

    user.cvId = cv._id;
    await user.save();

    return res.status(201).json({
      message: "Tạo hồ sơ thành công.",
      user,
      cv,
      success: true
    });
  } catch (error) {
    console.error("Lỗi khi tạo CV:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi tạo hồ sơ.", success: false });
  }
};

export const getCV = async (req, res) => {
    try {
        const cvId = req.params.id;
        if (!cvId || !mongoose.Types.ObjectId.isValid(cvId)) {
            return res.status(400).json({
                message: "ID CV không hợp lệ.",
                success: false
            });
        }

        const cv = await CV.findById(cvId)
                            .populate({ path: "created_by" })
                            .populate({ path: "skillGroups.skills" })
        if(!cv){
            return res.status(404).json({
                message: "Hồ sơ không tồn tại.",
                success: false
            })
        }
    
        return res.status(200).json({
            message: "Lấy thông tin CV thành công.",
            cv,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi lấy CV.",
            success: false
        });
    }
};

export const updateCV = async (req, res) => {
  try {
    const userId = req.id;
    const cvId = req.params.id;
    const file = req.file;

    const {
      fullname, office, birthday, sex, email, phoneNumber,
      address, github, hobbies, target, certificate, skillGroups,
      template
    } = req.body;

    let education = {};
    let experiences = [];
    let parsedSkillGroups = [];

    try {
      education = JSON.parse(req.body.education || "{}");
      experiences = JSON.parse(req.body.experiences || "[]");

      if (typeof skillGroups === "string") {
        parsedSkillGroups = JSON.parse(skillGroups);
      } else {
        parsedSkillGroups = skillGroups;
      }
    } catch {
      return res.status(400).json({ message: "Dữ liệu JSON không hợp lệ.", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại!", success: false });
    }

    const cv = await CV.findById(cvId);
    if (!cv || cv.created_by.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Không tìm thấy CV hoặc bạn không có quyền chỉnh sửa.", success: false });
    }

    const validationMessage = validateCVData({
      fullname, office, birthday, sex, email, phoneNumber, address,
      github, target, certificate, education, skillGroups: parsedSkillGroups, experiences, template // thêm template vào validate nếu có
    });

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage, success: false });
    }

    let avatarUrl = cv.avatar;
    if (file) {
      try {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
          resource_type: "auto",
          folder: "cvs",
          access_mode: "public"
        });
        avatarUrl = cloudResponse.secure_url;
      } catch {
        return res.status(500).json({ message: "Lỗi khi tải ảnh lên Cloudinary.", success: false });
      }
    }

    Object.assign(cv, {
      fullname,
      office,
      avatar: avatarUrl,
      birthday,
      sex,
      email,
      phoneNumber,
      address,
      github,
      hobbies,
      target,
      certificate,
      education,
      skillGroups: parsedSkillGroups,
      experiences,
      template
    });

    await cv.save();

    return res.status(200).json({ message: "Cập nhật hồ sơ thành công.", cv, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật hồ sơ.", success: false });
  }
};

export const deleteCV = async (req, res) => {
    try {
        const cvId = req.params.id;
        const userId = req.id;
        const cv = await CV.findById(cvId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "Người dùng không tồn tại!",
                success: false
            });
        }

        if (!cv) {
            return res.status(404).json({
                message: "Không tìm thấy hồ sơ.",
                success: false
            });
        }

        await CV.findByIdAndDelete(cvId);
        user.cvId = null;
        await user.save();

        return res.status(200).json({
            message: "Hồ sơ đã được xóa.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi xóa hồ sơ.",
            success: false,
            error: error.message
        });
    }
};