"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    company: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
jobSchema.index({
    title: "text",
    department: "text",
    location: "text",
    tags: "text",
}, { name: "jobs_text_index" });
exports.JobModel = mongoose_1.default.model("Jobs", jobSchema);
