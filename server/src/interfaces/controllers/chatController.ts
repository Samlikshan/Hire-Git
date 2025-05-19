// src/interfaces/controllers/ChatController.ts
import { NextFunction, Request, Response } from "express";
import { ChatRepository } from "../../infrastructure/database/repositories/ChatRepository";
import { GetChatsUseCase } from "../../domain/usecases/Chat/GetChatsUseCase";
import { GetMessagesUseCase } from "../../domain/usecases/Chat/GetMessagesUseCase";
import { MessageRepository } from "../../infrastructure/database/repositories/MessageRepository";
import { CreateChatUseCase } from "../../domain/usecases/Chat/CreateChatUseCase";
import { SendMessageUseCase } from "../../domain/usecases/Chat/SendMessageUseCase";
import { MarkMessagesAsReadUseCase } from "../../domain/usecases/Chat/MarkMessageAsReadUseCase";
import { MessageService } from "../../infrastructure/services/MessageService";
import { HttpException } from "../../domain/enums/http-exception";
import { HttpStatus } from "../../domain/enums/http-status.enum";
import { GetUnreadMessagesUseCase } from "../../domain/usecases/Chat/GetUnReadMessageUseCase";
export class ChatController {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;
  private messageService: MessageService;
  private getChatsUseCase: GetChatsUseCase;
  private getMessagesUseCase: GetMessagesUseCase;
  private createChatUseCase: CreateChatUseCase;
  private sendMessageUseCase: SendMessageUseCase;
  private markMessagesAsReadUseCase: MarkMessagesAsReadUseCase;
  private getUnreadMessagesUseCase: GetUnreadMessagesUseCase;

  constructor() {
    // Initialize core services first
    this.chatRepository = new ChatRepository();
    this.messageRepository = new MessageRepository();
    this.messageService = new MessageService();

    // Initialize use cases with shared dependencies
    this.getChatsUseCase = new GetChatsUseCase(this.chatRepository);
    this.getMessagesUseCase = new GetMessagesUseCase(this.messageRepository);
    this.createChatUseCase = new CreateChatUseCase(
      this.chatRepository,
      this.messageService
    );
    this.sendMessageUseCase = new SendMessageUseCase(
      this.messageRepository,
      this.chatRepository,
      this.messageService
    );
    this.markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(
      this.messageRepository,
      this.messageService
    );

    this.getUnreadMessagesUseCase = new GetUnreadMessagesUseCase(
      this.messageRepository
    );
  }

  createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId, candidateId, jobId } = req.body;
      const chat = await this.createChatUseCase.execute(
        companyId,
        candidateId,
        jobId
      );
      res.status(201).json(chat);
    } catch (error) {
      next(error);
    }
  };

  sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId } = req.params;
      const { senderType, senderId, receiverId } = req.body;
      const content = req.file
        ? (req.file as any).location // S3 URL
        : req.body.content;

      const type = req.file
        ? req.file.mimetype.startsWith("image/")
          ? "image"
          : "file"
        : "text";
      console.log(content, ":content", type, ":type");
      const message = await this.sendMessageUseCase.execute(
        chatId,
        senderType,
        senderId,
        content,
        receiverId,
        type
      );

      res.json(message);
    } catch (error) {
      next(error);
    }
  };
  getChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Add proper type checking
      if (!req.user || !req.user.id || !req.user.role) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      const { id: userId, role: userType } = req.user;

      const chats = await this.getChatsUseCase.execute(userId, userType);
      res.json(chats);
    } catch (error) {
      next(error);
    }
  };

  getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId } = req.params;
      const messages = await this.getMessagesUseCase.execute(chatId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };

  // src/interfaces/controllers/ChatController.ts
  markMessagesAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { chatId } = req.params;
      const { messageId } = req.body; // Optional messageId
      if (!req.user || !req.user.id) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      await this.markMessagesAsReadUseCase.execute(
        chatId,
        req.user.id,
        messageId
      );
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
  getUnreadMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { chatId } = req.params;
      if (!req.user || !req.user.id) {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      const messages = await this.getUnreadMessagesUseCase.execute(
        chatId,
        req.user.id
      );
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };
}
