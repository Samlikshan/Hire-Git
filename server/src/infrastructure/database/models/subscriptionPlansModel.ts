import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    monthlyPrice: { type: Number, required: true },
    features: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    stripePriceId: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SubscriptionPlanModel = mongoose.model(
  "Plan",
  subscriptionPlanSchema
);
