"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const interviewSchema = new mongoose_1.default.Schema({
    application: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Applications",
        required: true,
    },
    job: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Jobs",
        required: true,
    },
    scheduledAt: { type: Date, required: true },
    duration: { type: String, required: true },
    time: { type: String, required: true },
    timeZone: { type: String, default: "UTC" },
    roomId: { type: String, required: true },
    meetingLink: { type: String, required: true },
    round: { type: String, requierd: true, default: "First Round" },
    mode: {
        type: String,
        enum: ["video", "phone", "in-person"],
        default: "video",
    },
    cancelReason: { type: String },
    status: {
        type: String,
        enum: [
            "scheduled",
            "completed",
            "cancelled",
            "pending",
            "hired",
            "rejected",
        ],
        default: "scheduled",
    },
    //   recordingUrl: { type: String },
    //   transcriptUrl: { type: String },
    offerLetter: { type: String },
    offerStatus: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: null,
    },
    signedOfferLetter: { type: String },
    offerSentAt: { type: Date },
    offerAcceptedAt: { type: Date },
    offerRejectedAt: { type: Date },
    candidateFeedback: { type: String },
    rejectionReason: { type: String },
    feedback: { type: String },
    evaluation: {
        completedAt: { type: Date },
        ratings: {
            communication: { type: Number, min: 1, max: 5 },
            technical: { type: Number, min: 1, max: 5 },
            cultureFit: { type: Number, min: 1, max: 5 },
        },
        notes: { type: String },
        recommendation: { type: String, enum: ["hire", "hold", "reject"] },
    },
    note: { type: String },
}, { timestamps: true });
exports.InterviewModel = mongoose_1.default.model("Interviews", interviewSchema);
