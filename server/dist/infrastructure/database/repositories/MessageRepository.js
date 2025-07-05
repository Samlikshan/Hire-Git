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
exports.MessageRepository = void 0;
const messageModel_1 = require("../models/messageModel");
class MessageRepository {
    create(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return messageModel_1.messageModel.create(Object.assign(Object.assign({}, message), { timestamp: new Date() }));
        });
    }
    getChatMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return messageModel_1.messageModel.find({ chatId }).sort("timestamp");
        });
    }
    updateStatus(messageId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return messageModel_1.messageModel.findByIdAndUpdate(messageId, { status }, { new: true });
        });
    }
    // src/infrastructure/database/repositories/MessageRepository.ts
    markMessagesAsRead(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield messageModel_1.messageModel.updateMany({
                chatId,
                senderId: { $ne: userId },
                status: { $in: ["sent", "delivered"] },
            }, { $set: { status: "read" } });
        });
    }
    getUnreadMessages(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return messageModel_1.messageModel
                .find({
                chatId,
                senderId: { $ne: userId },
                status: { $in: ["sent", "delivered"] },
            })
                .sort("timestamp");
        });
    }
}
exports.MessageRepository = MessageRepository;
