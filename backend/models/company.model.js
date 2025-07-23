import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    abbreviationName: { type: String },
    description: { type: String },
    email: { type: String },
    website: { type: String },
    location: { type: String },
    address: { type: String },
    logo: { type: String },
    background: { type: String },
    hotline: { type: String },
    field: { type: String },
    jobCount: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    views: { type: Number, default: 0 }
}, {timestamps: true});

export const Company = mongoose.model('Company', companySchema);