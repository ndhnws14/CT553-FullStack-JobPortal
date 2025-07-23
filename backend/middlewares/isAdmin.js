import { User } from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.id);
    if (!user || user.role !== "Quản trị viên") {
        return res.status(403).json({
            message: "Bạn không có quyền truy cập chức năng này!",
            success: false
        });
    }
    next();
}