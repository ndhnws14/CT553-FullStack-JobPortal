import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    exprience: { type: String, required: true },
    skill_description: { type: String, required: true },
    target: { type: String, required: true },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {timestamps: true});

export const Level = mongoose.model("Level", levelSchema);