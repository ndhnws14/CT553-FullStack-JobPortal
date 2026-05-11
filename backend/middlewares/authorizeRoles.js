import { AppError } from "../utils/AppError.js";

export const authorizeRoles = ( ...roles ) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            return next(new AppError("Bạn không có quyền truy cập chức năng này!", 403));
        }
        next();
    }
};