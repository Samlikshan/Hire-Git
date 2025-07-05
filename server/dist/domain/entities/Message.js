"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
// src/domain/entities/Message.ts
class Message {
    constructor(_id, chatId, senderType, senderId, content, status = "sent", type, createdAt, updatedAt) {
        this._id = _id;
        this.chatId = chatId;
        this.senderType = senderType;
        this.senderId = senderId;
        this.content = content;
        this.status = status;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Message = Message;
