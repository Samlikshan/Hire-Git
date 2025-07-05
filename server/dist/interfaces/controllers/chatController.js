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
exports.ChatController = void 0;
const ChatRepository_1 = require("../../infrastructure/database/repositories/ChatRepository");
const GetChatsUseCase_1 = require("../../domain/usecases/Chat/GetChatsUseCase");
const GetMessagesUseCase_1 = require("../../domain/usecases/Chat/GetMessagesUseCase");
const MessageRepository_1 = require("../../infrastructure/database/repositories/MessageRepository");
const CreateChatUseCase_1 = require("../../domain/usecases/Chat/CreateChatUseCase");
const SendMessageUseCase_1 = require("../../domain/usecases/Chat/SendMessageUseCase");
const MarkMessageAsReadUseCase_1 = require("../../domain/usecases/Chat/MarkMessageAsReadUseCase");
const MessageService_1 = require("../../infrastructure/services/MessageService");
const http_exception_1 = require("../../domain/enums/http-exception");
const http_status_enum_1 = require("../../domain/enums/http-status.enum");
const GetUnReadMessageUseCase_1 = require("../../domain/usecases/Chat/GetUnReadMessageUseCase");
class ChatController {
    constructor() {
        this.createChat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId, candidateId, jobId } = req.body;
                const chat = yield this.createChatUseCase.execute(companyId, candidateId, jobId);
                res.status(201).json(chat);
            }
            catch (error) {
                next(error);
            }
        });
        this.sendMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId } = req.params;
                const { senderType, senderId, receiverId } = req.body;
                const content = req.file
                    ? req.file.location // S3 URL
                    : req.body.content;
                const type = req.file
                    ? req.file.mimetype.startsWith("image/")
                        ? "image"
                        : "file"
                    : "text";
                const message = yield this.sendMessageUseCase.execute(chatId, senderType, senderId, content, receiverId, type);
                res.json(message);
            }
            catch (error) {
                next(error);
            }
        });
        this.getChats = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Add proper type checking
                if (!req.user || !req.user.id || !req.user.role) {
                    throw new http_exception_1.HttpException("Unauthorized", http_status_enum_1.HttpStatus.UNAUTHORIZED);
                }
                const { id: userId, role: userType } = req.user;
                const chats = yield this.getChatsUseCase.execute(userId, userType);
                res.json(chats);
            }
            catch (error) {
                next(error);
            }
        });
        this.getMessages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId } = req.params;
                const messages = yield this.getMessagesUseCase.execute(chatId);
                res.json(messages);
            }
            catch (error) {
                next(error);
            }
        });
        // src/interfaces/controllers/ChatController.ts
        this.markMessagesAsRead = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId } = req.params;
                const { messageId } = req.body; // Optional messageId
                if (!req.user || !req.user.id) {
                    throw new http_exception_1.HttpException("Unauthorized", http_status_enum_1.HttpStatus.UNAUTHORIZED);
                }
                yield this.markMessagesAsReadUseCase.execute(chatId, req.user.id, messageId);
                res.status(200).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
        this.getUnreadMessages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId } = req.params;
                if (!req.user || !req.user.id) {
                    throw new http_exception_1.HttpException("Unauthorized", http_status_enum_1.HttpStatus.UNAUTHORIZED);
                }
                const messages = yield this.getUnreadMessagesUseCase.execute(chatId, req.user.id);
                res.json(messages);
            }
            catch (error) {
                next(error);
            }
        });
        // Initialize core services first
        this.chatRepository = new ChatRepository_1.ChatRepository();
        this.messageRepository = new MessageRepository_1.MessageRepository();
        this.messageService = new MessageService_1.MessageService();
        // Initialize use cases with shared dependencies
        this.getChatsUseCase = new GetChatsUseCase_1.GetChatsUseCase(this.chatRepository);
        this.getMessagesUseCase = new GetMessagesUseCase_1.GetMessagesUseCase(this.messageRepository);
        this.createChatUseCase = new CreateChatUseCase_1.CreateChatUseCase(this.chatRepository, this.messageService);
        this.sendMessageUseCase = new SendMessageUseCase_1.SendMessageUseCase(this.messageRepository, this.chatRepository, this.messageService);
        this.markMessagesAsReadUseCase = new MarkMessageAsReadUseCase_1.MarkMessagesAsReadUseCase(this.messageRepository, this.messageService);
        this.getUnreadMessagesUseCase = new GetUnReadMessageUseCase_1.GetUnreadMessagesUseCase(this.messageRepository);
    }
}
exports.ChatController = ChatController;
