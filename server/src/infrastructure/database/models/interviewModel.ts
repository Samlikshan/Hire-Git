import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applications",
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
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    //   recordingUrl: { type: String },
    //   transcriptUrl: { type: String },
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
  },
  { timestamps: true }
);

export const InterviewModel = mongoose.model("Interviews", interviewSchema);
