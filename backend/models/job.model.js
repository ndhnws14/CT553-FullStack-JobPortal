import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    requiredSkills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TechSkill'
    }],
    requiredLevels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level'
    }],
    benefit: { type: String, required: true },
    salary: { type: String, required: true },
    jobType: { type: String, required: true },
    quantity: { type: Number, required: true },
    duration: { type: Date, required: true },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    views: { type: Number, default: 0 }
}, {timestamps: true});

jobSchema.index({ title: "text", description: "text", requirements: "text" });
jobSchema.index({ company: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ requiredLevels: 1 });
jobSchema.index({ duration: 1 });
jobSchema.index({ createdAt: -1 });

export const Job = mongoose.model('Job', jobSchema);
