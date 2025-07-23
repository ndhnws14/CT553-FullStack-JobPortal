import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type: String ,required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, default: "" },
    password: { type: String, default: "" },
    role: { 
        type: String, required: true,
        enum: ['Ứng viên', 'Nhà tuyển dụng', 'Quản trị viên']
    },
    type: {
        type: String, required: true,
        enum: ['login', 'loginGoogle']
    },
    googleId: { type: String, unique: true, sparse: true },
    profile: {
        profilePhoto: { type: String, default:"" },
        skills: [{
            skill: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'TechSkill'
            },
            proficiency: {
                type: String,
                enum: ['Cơ bản', 'Trung bình', 'Khá', 'Tốt']
            }
        }],
        bio: {type: String},
        level: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Level'
        },
        github: {type: String},
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }
    },
    cvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'CV',
        default: null
    },
    lovedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            default: []
        }
    ],
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            default: []
        }
    ],
    followCompanies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            default: []
        }
    ]
}, {timestamps: true});

export const User = mongoose.model('User', userSchema);