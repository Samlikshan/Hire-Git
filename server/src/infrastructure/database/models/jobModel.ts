import mongoose from "mongoose";
import { Job } from "../../../domain/entities/Job";
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    title: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    requirements: { type: [String] },
    responsibilities: { type: [String] },
    requiredSkills: { type: [String], required: true },
    tags: { type: [String], required: true },
    status: {
      type: String,
      enum: ["draft", "active", "closed"],
      default: "Draft",
    },
    deadline: { type: Date, required: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JobModel = mongoose.model<Job>("Jobs", jobSchema);
