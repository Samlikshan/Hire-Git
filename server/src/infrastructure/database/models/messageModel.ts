// src/infrastructure/models/messageModel.ts
import mongoose, { Schema } from "mongoose";
import { Message } from "../../../domain/entities/Message";

// src/infrastructure/models/messageModel.ts
const messageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    senderType: {
      type: String,
      enum: ["company", "candidate"],
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: true, // Auto-add createdAt and updatedAt
    versionKey: false,
  }
);

export const messageModel = mongoose.model<Message>("Message", messageSchema);
