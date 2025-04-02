import mongoose, { mongo } from "mongoose";
import { JobApplication } from "../../../domain/entities/JobApplication";

const jobApplicatonScema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidates",
    required: true,
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobs",
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  education: { type: String, required: true },
  currentTitle: { type: String, required: true },
  experience: { type: String, required: true },
  expectedSalary: { type: String, required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String },
  status: {
    type: String,
    enum: ["applied", "shortlisted", "in-progress", "hired", "rejected"],
    default: "applied",
  },
  feedback: { type: String },
});

export const JobApplicationModel = mongoose.model<JobApplication>(
  "Applications",
  jobApplicatonScema
);
