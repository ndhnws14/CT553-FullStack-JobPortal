import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  office: { type: String, required: true },
  avatar: { type: String, default: "" },
  birthday: { type: Date, required: true },
  sex: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, default: "" },
  address: { type: String, required: true },
  github: { type: String, required: true },
  hobbies: { type: String },
  target: { type: String, required: true },
  certificate: { type: String },
  education: {
    schoolName: { type: String },
    course: { type: String },
    major: { type: String },
    graduate: { type: String },
  },
  skillGroups: [
    {
      category: { type: String, required: true },
      skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TechSkill",
      }]
    }
  ],
  experiences: [
    {
      completionTime: { type: String },
      projectName: { type: String },
      description: { type: String },
      link: { type: String },
      member: { type: String },
      technology: { type: String },
      function: { type: String },
    },
  ],
  template: {
    type: String,
    required: true,
    enum: ['classic', 'modern', 'minimal', 'creative']
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export const CV = mongoose.model("CV", cvSchema);
