import mongoose from "mongoose";
import { Notification } from "../../../domain/entities/Notification";

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String },
    title: { type: String },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs" },
    // company: { type: mongoose.Schema.Types.ObjectId, ref: "Companies" },
    candidate: { type: mongoose.Schema.Types.ObjectId, res: "Cadidates" },
    message: { type: String },
    read: { type: Boolean, default: false },
    action: { type: { type: String }, label: String, url: String },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<Notification>(
  "Notifications",
  notificationSchema
);
