import { Level } from "../models/level.model.js";

export const createLevel = async (req, res) => {
  try {
    const { name, exprience, skill_description, target } = req.body;

    const newLevel = new Level({ name, exprience, skill_description, target});
    await newLevel.save();

    res.status(201).json({ success: true, message: "Thêm trình độ IT thành công.", data: newLevel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create level", error: error.message });
  }
};

export const getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find();
    res.status(200).json({ success: true, levels });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch levels", error: error.message });
  }
};

export const getLevelById = async (req, res) => {
  try {
    const levelId = req.params.id;
    const level = await Level.findById(levelId);
    if(!level){
      return res.status(400).json({
        message: "Không tìm thấy trình độ",
        success: false
      });
    }
    res.status(200).json({ success: true, level });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch levels", error: error.message });
  }
};

export const updateLevel = async (req, res) => {
  try {
    const levelId = req.params.id;
    const updatedData = req.body;

    const updatedLevel = await Level.findByIdAndUpdate(levelId, updatedData, { new: true });

    if (!updatedLevel) {
      return res.status(404).json({ success: false, message: "Không tìm thấy trình độ." });
    }

    res.status(200).json({ success: true, message: "Cập nhật thông tin trình độ thành công.", data: updatedLevel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update level", error: error.message });
  }
};


export const deleteLevel = async (req, res) => {
  try {
    const levelId = req.params.id;

    const deletedLevel = await Level.findByIdAndDelete(levelId);

    if (!deletedLevel) {
      return res.status(404).json({ success: false, message: "Không tìm thấy trình độ." });
    }

    res.status(200).json({ success: true, message: "Trình độ IT đã được xóa" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete level", error: error.message });
  }
};
