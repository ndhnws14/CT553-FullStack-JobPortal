import { TechSkill } from "../models/techskill.model.js";
import { SkillRequest } from "../models/skillRequest.model.js";
import { emitNotification } from "../utils/emitNotification.js";
import { Notification } from "../models/notification.model.js";

export const createSkill = async (req, res) => {
    try {
        const adminId = req.id;
        const { name, category } = req.body;
        
        if (!name || !category) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ các thông tin!",
                success: false
            });
        };

        const checkSkill = await TechSkill.findOne({name});
        if (checkSkill) {
            return res.status(400).json({
                message: "Kỹ năng này đã được tạo trước đó. Vui lòng nhập kỹ năng khác!",
                success: false
            });
        };

        const techskill = await TechSkill.create({
            name,
            category,
            created_by: adminId
        });

        return res.status(201).json({
            message: "Tạo công việc mới thành công.",
            techskill,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi tạo công nghệ-kỹ năng.",
            success: false,
            error: error.message
        });
    }
};

export const updateSkill = async (req, res) => {
    try {
        const skillId = req.params.id;
        const { name, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                message: "Vui lòng cung cấp đầy đủ tên và danh mục kỹ năng!",
                success: false
            });
        }

        const updateData = { name, category };

        const skill = await TechSkill.findByIdAndUpdate(skillId, updateData, { new: true });
        if (!skill) {
            return res.status(404).json({
                message: "Không tìm thấy kỹ năng.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Kỹ năng đã được cập nhật.",
            skill,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi cập nhật kỹ năng.",
            success: false,
            error: error.message
        });
    }
};

export const removeSkill = async (req, res) => {
    try {
        const skillId = req.params.id;

        const skill = await TechSkill.findByIdAndDelete(skillId);
        if (!skill) {
            return res.status(404).json({
                message: "Không tìm thấy kỹ năng.",
                success: false
            });
        };

        const updatedSkills = await TechSkill.find({ created_by: req.id });
        return res.status(200).json({
            message: "Kỹ năng đã được xoá thành công.",
            success: true,
            skills: updatedSkills
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi xóa kỹ năng.",
            success: false,
            error: error.message
        });
    }
};

export const getAllSkills = async (req, res) => {
    try {
      const { category, search, page = 1, limit = 10 } = req.query;
  
      const query = {};
  
      if (category?.trim()) {
        query.category = { $regex: category.trim(), $options: "i" };
      }
  
      if (search?.trim()) {
        query.name = { $regex: search.trim(), $options: "i" };
      }
  
      const totalSkills = await TechSkill.countDocuments(query);
  
      const skills = await TechSkill.find(query)
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));
  
      return res.status(200).json({
        skills,
        totalSkills,
        totalPages: Math.ceil(totalSkills / limit),
        currentPage: Number(page),
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Đã xảy ra lỗi khi lấy danh sách kỹ năng.",
        success: false,
        error: error.message,
      });
    }
};

export const requestSkill = async (req, res) => {
  const { name } = req.body;
  const userId = req.id;

  try {
    if (!name || name.length < 2) {
      return res.status(400).json({ success: false, message: 'Tên kỹ năng không hợp lệ.' });
    }

    const existed = await TechSkill.findOne({ name });
    if (existed) {
      return res.status(409).json({ success: false, message: 'Kỹ năng đã tồn tại trong hệ thống.' });
    }

    const skillRequest = await SkillRequest.create({ name, requestedBy: userId });

    const io = req.app.get('io');
    io.emit("skill_request", skillRequest);

    res.status(200).json({ success: true, message: 'Đã gửi yêu cầu thành công.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
};

export const getRequest = async (req, res) => {
    try {
        const requestSkills = await SkillRequest.find().populate('requestedBy');
        if(!requestSkills) {
            return res.status(400).json({
                message: "Không tìm thấy yêu cầu",
                success: false
            });
        };
        return res.status(200).json({
            requestSkills,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
};

export const updateStatusRequest = async (req, res) => {
    try {
        const { status } = req.body;
        if(!status) {
            return res.status(400).json({
                message: "Bắt buộc.",
                success: false
            });
        };
        const requestSkillId = req.params.id;
        const requestSkill = await SkillRequest.findById({_id: requestSkillId});
        if(!requestSkill) {
            return res.status(400).json({
                message: "Không tìm thấy trạng thái.",
                success: false
            });
        };
        const oldStatus = requestSkill.status;
        if (oldStatus === status) {
            return res.status(200).json({
                message: "Trạng thái không thay đổi.",
                success: true
            });
        }

        requestSkill.status = status;
        await requestSkill.save();

        const requestedBy = requestSkill.requestedBy
        const notification = await Notification.create({
            recipient: requestedBy,
            sender: req.id,
            type: 'Yêu cầu kỹ năng',
            message: `Yêu cầu kỹ năng "${requestSkill.name}" của bạn Quản trị viên đã ${status}.`,
            isRead: false
        });
        const io = req.app.get("io");
        const onlineUsers = req.app.get("onlineUsers");

        emitNotification(io, onlineUsers, requestedBy, {
            ...notification._doc,
            message: `Yêu cầu kỹ năng "${requestSkill.name}" của bạn Quản trị viên đã ${status}.`,
        });
        

        return res.status(200).json({
            message: "Trạng thái yêu cầu cập nhập thành công.",
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
};

export const removeRequestSkill = async (req, res) => {
    try {
        const requestSkillId = req.params.id;

        const requestSkill = await SkillRequest.findByIdAndDelete(requestSkillId);
        if (!requestSkill) {
            return res.status(404).json({
                message: "Không tìm thấy yêu cầu.",
                success: false
            });
        };

        return res.status(200).json({
            message: "Yêu cầu đã được xoá thành công.",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi xóa yêu cầu.",
            success: false,
            error: error.message
        });
    }
};

  
