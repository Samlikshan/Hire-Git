"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
// src/infrastructure/models/chatModel.ts
const mongoose_1 = __importStar(require("mongoose"));
const MessageSchema = new mongoose_1.Schema({
    chatId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Chat", required: true },
    senderType: {
        type: String,
        enum: ["company", "candidate"],
        required: true,
    },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    status: {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent",
    },
}, { timestamps: true });
const ChatSchema = new mongoose_1.Schema({
    companyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Companies",
        required: true,
    },
    candidateId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Candidates",
        required: true,
    },
    jobId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Jobs", required: true },
    messages: [MessageSchema],
    lastMessage: MessageSchema,
}, { timestamps: true });
exports.chatModel = mongoose_1.default.model("Chat", ChatSchema);
