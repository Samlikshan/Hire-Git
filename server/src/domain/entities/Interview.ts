import mongoose from "mongoose";
import { JobApplication } from "./JobApplication";

export class Interview {
  constructor(
    public application: mongoose.Types.ObjectId | JobApplication,
    public job: mongoose.Types.ObjectId,
    public scheduledAt: Date,
    public duration: string,
    public timeZone: string,
    public roomId: string,
    public meetingLink: string,
    public round: string,
    public status?:
      | "scheduled"
      | "completed"
      | "cancelled"
      | "pending"
      | "hired"
      | "rejected",
    public offerLetter?: string | null,
    public offerStatus?: "pending" | "accepted" | "rejected",
    public signedOfferLetter?: string | null,
    public offerSentAt?: Date | null,
    public offerRejectedAt?: Date | null,
    public candidateFeedback?: string | null,
    public rejectionReason?: string | null,
    public note?: string | null,
    public feedback?: string | null,
    public evaluation?: {
      ratings?: {
        communication?: number | null;
        technical?: number | null;
        cultureFit?: number | null;
      } | null;
      notes?: string | null;
      recommendation?: "hire" | "hold" | "reject" | null;
      completedAt?: Date | null;
    } | null,
    public _id?: mongoose.Types.ObjectId
  ) {}
}
