"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobApplicatonSchema = new mongoose_1.default.Schema({
    candidate: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Candidates",
        required: true,
    },
    job: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.JobApplicationModel = mongoose_1.default.model("Applications", jobApplicatonSchema);
