import mongoose from "mongoose";

const skillRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Chờ duyệt', 'Duyệt', 'Từ chối'], default: 'Chờ duyệt' }
}, {timestamps: true});

export const SkillRequest = mongoose.model('SkillRequest', skillRequestSchema);
