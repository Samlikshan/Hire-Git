import mongoose, { Schema, Document } from "mongoose";

export interface CheckoutSession extends Document {
  userId: string;
  sessionId: string;
  status: "pending" | "completed" | "expired";
  createdAt: Date;
  updatedAt: Date;
}

const CheckoutSessionSchema = new Schema<CheckoutSession>({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "completed", "expired"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<CheckoutSession>(
  "CheckoutSession",
  CheckoutSessionSchema
);
