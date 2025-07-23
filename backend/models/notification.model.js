import mongoose from "mongoose";

const notificationShema = new mongoose.Schema({
    recipient: { // người nhận thông báo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: { // người tạo thông báo (ứng viên hoặc nhà tuyển dụng)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String, required: true,
        enum: ['Ứng tuyển', 'Đã xác nhận', 'Đã bị hủy', 'Phỏng vấn', 'Đăng bài', 'Yêu cầu kỹ năng']
    },
    message: { type: String, required: true },
    relatedJob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    isRead: { type: Boolean, default: false },
}, {timestamps: true});

export const Notification = mongoose.model("Notification", notificationShema);