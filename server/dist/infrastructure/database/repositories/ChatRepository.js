"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const chatModel_1 = require("../models/chatModel");
const messageModel_1 = require("../models/messageModel");
class ChatRepository {
    create(chat) {
        return __awaiter(this, void 0, void 0, function* () {
            return chatModel_1.chatModel.create(chat);
        });
    }
    findByParticipants(companyId, candidateId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chatModel_1.chatModel
                .findOne({ companyId, candidateId, jobId })
                .populate("companyId jobId");
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return chatModel_1.chatModel.findById(id);
        });
    }
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chatModel_1.chatModel
                .find({ candidateId: userId })
                .populate("companyId jobId")
                .sort({ createdAt: -1 });
        });
    }
    getCompanyChats(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chatModel_1.chatModel.find({ companyId }).populate("candidateId jobId").sort({ createdAt: -1 });
        });
    }
    updateLastMessage(chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return chatModel_1.chatModel.findByIdAndUpdate(chatId, { $set: { lastMessage: message, updatedAt: new Date() } }, { new: true });
        });
    }
    getUnreadMessageCount(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return messageModel_1.messageModel.countDocuments({
                chatId,
                senderId: { $ne: userId },
                status: { $in: ["sent", "delivered"] },
            });
        });
    }
}
exports.ChatRepository = ChatRepository;
