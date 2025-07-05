"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
class Chat {
    constructor(_id, companyId, candidateId, jobId, messages = [], lastMessage, createdAt, updatedAt) {
        this._id = _id;
        this.companyId = companyId;
        this.candidateId = candidateId;
        this.jobId = jobId;
        this.messages = messages;
        this.lastMessage = lastMessage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Chat = Chat;
