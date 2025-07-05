"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const candidateSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profession: { type: String },
    bio: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    profileImage: { type: String },
    socialLinks: { linkedIn: { type: String }, gitHub: { type: String } },
    skills: [String],
    resume: { type: String },
    experience: [
        {
            jobTitle: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String,
            location: String,
        },
    ],
    projects: [{}],
    profileCompleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    savedJobs: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Jobs" }]
}, { timestamps: true });
exports.CandidateModel = mongoose_1.default.model("Candidates", candidateSchema);
