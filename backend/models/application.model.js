import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ["Đang gửi", "Đã xác nhận", "Đã bị hủy"],
        default: 'Đang gửi'
    },
    interviewDate: {
        type: Date,
        default: null
    },
}, {timestamps: true});

export const Application = mongoose.model('Application', applicationSchema);