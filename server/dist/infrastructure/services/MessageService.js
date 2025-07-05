"use strict";
// src/infrastructure/services/MessageService.ts
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
exports.MessageService = void 0;
const socket_1 = require("../../config/socket");
const chatModel_1 = require("../database/models/chatModel");
class MessageService {
    notifyChatCreated(chat) {
        return __awaiter(this, void 0, void 0, function* () {
            // Notify both participants
            socket_1.socketProvider.emitToUser(chat.companyId.toString(), "chat_created", chat);
            socket_1.socketProvider.emitToUser(chat.candidateId.toString(), "chat_created", chat);
            return true;
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get receiver ID based on sender type
            const chat = yield chatModel_1.chatModel.findById(message.chatId);
            if (!chat)
                return false;
            const receiverId = message.senderType === "company" ? chat.candidateId : chat.companyId;
            socket_1.socketProvider.emitToUser(receiverId.toString(), "new_message", message);
            return true;
        });
    }
    // src/infrastructure/services/MessageService.ts
    notifyMessageRead(messageId, chatId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield chatModel_1.chatModel.findById(chatId);
            if (!chat)
                return false;
            socket_1.socketProvider.emitToUser(senderId.toString(), "message_read", {
                messageId,
                chatId,
            });
            return true;
        });
    }
}
exports.MessageService = MessageService;
