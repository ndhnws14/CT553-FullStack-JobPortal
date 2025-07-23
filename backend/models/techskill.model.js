import mongoose from "mongoose";

const tech_skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true});

export const TechSkill = mongoose.model("TechSkill", tech_skillSchema);