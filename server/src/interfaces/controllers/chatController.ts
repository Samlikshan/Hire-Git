// src/interfaces/controllers/ChatController.ts
import { NextFunction, Request, Response } from "express";
import { ChatRepository } from "../../infrastructure/database/repositories/ChatRepository";
import { GetChatsUseCase } from "../../domain/usecases/Chat/GetChatsUseCase";
import { GetMessagesUseCase } from "../../domain/usecases/Chat/GetMessagesUseCase";
import { MessageRepository } from "../../infrastructure/database/repositories/MessageRepository";
import { CreateChatUseCase } from "../../domain/usecases/Chat/CreateChatUseCase";
import { SendMessageUseCase } from "../../domain/usecases/Chat/SendMessageUseCase";
import { MessageService } from "../../infrastructure/services/MessageService";
import { HttpException } from "../../domain/enums/http-exception";
import { HttpStatus } from "../../domain/enums/http-status.enum";
export class ChatController {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;
  private messageService: MessageService;
  private getChatsUseCase: GetChatsUseCase;
  private getMessagesUseCase: GetMessagesUseCase;
  private createChatUseCase: CreateChatUseCase;
  private sendMessageUseCase: SendMessageUseCase;

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
      const { senderType, senderId, content, receiverId } = req.body;
      const message = await this.sendMessageUseCase.execute(
        chatId,
        senderType,
        senderId,
        content,
        receiverId
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
}
