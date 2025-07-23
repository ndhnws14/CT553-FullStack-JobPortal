import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded?.userId) {
      return res.status(401).json({
        message: "Token không hợp lệ.",
        success: false,
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Không tìm thấy người dùng.",
        success: false,
      });
    }

    req.id = user._id;
    req.user = user;

    next();
  } catch (error) {
    console.error("Middleware Auth Error:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi xác thực.",
      success: false,
    });
  }
};

export default isAuthenticated;
