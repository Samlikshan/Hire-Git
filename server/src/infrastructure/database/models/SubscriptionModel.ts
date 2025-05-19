import mongoose from "mongoose";
import { Subscription } from "../../../domain/entities/Subscription";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    stripeSubscriptionId: { type: String, required: true },
    stripeSubscriptionItemId: { type: String, required: true },
    stripeCustomerId: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "canceled"],
      default: "active",
    },
    startedAt: { type: Date, required: true },
    nextBillingDate: { type: Date },
    invoiceId: { type: String },
    invoice: { type: String },
    jobsPostedThisMonth: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SubscriptionModel = mongoose.model<Subscription>(
  "Subscriptions",
  SubscriptionSchema
);
