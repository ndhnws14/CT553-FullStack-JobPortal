import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.slipt(" ")[1]; 
    if (!token) {
      throw new AppError("Bạn chưa đăng nhập.", 401)
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded?.userId) {
      throw new AppError("Token không hợp lệ.", 401)
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new AppError("Không tìm thấy người dùng.", 401)
    }

    req.id = user._id;
    req.user = user;
    req.role = user.role;

    next();
  } catch (error) {
    next();
  }
};

export default isAuthenticated;
