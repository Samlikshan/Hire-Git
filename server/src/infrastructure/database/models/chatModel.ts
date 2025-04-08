// src/infrastructure/models/chatModel.ts
import mongoose, { Schema } from "mongoose";
import { Message } from "../../../domain/entities/Message";
import { Chat } from "../../../domain/entities/Chat";

const MessageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    senderType: {
      type: String,
      enum: ["Companies", "Candidates"],
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
  { timestamps: true }
);

const ChatSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidates",
      required: true,
    },
    jobId: { type: Schema.Types.ObjectId, ref: "Jobs", required: true },
    messages: [MessageSchema],
    lastMessage: MessageSchema,
  },
  { timestamps: true }
);

export const chatModel = mongoose.model<Chat>("Chat", ChatSchema);
