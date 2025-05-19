// src/domain/usecases/Chat/MarkMessagesAsReadUseCase.ts
import { IMessageRepository } from "../../repositories/IMessageRepository";
import { MessageService } from "../../../infrastructure/services/MessageService";
import { HttpException } from "../../enums/http-exception";
import { HttpStatus } from "../../enums/http-status.enum";

export class MarkMessagesAsReadUseCase {
  constructor(
    private messageRepository: IMessageRepository,
    private messageService: MessageService
  ) {}

  async execute(
    chatId: string,
    userId: string,
    messageId?: string
  ): Promise<void> {
    if (!chatId || !userId) {
      throw new HttpException(
        "Missing required fields",
        HttpStatus.BAD_REQUEST
      );
    }

    if (messageId) {
      // Mark a single message as read
      const message = await this.messageRepository.updateStatus(
        messageId,
        "read"
      );
      if (message) {
        await this.messageService.notifyMessageRead(
          messageId,
          chatId,
          message.senderId
        );
      }
    } else {
      // Mark all unread messages as read
      await this.messageRepository.markMessagesAsRead(chatId, userId);
      // Notify sender of read status for all messages (optional, can be optimized)
      const messages = await this.messageRepository.getChatMessages(chatId);
      for (const message of messages) {
        if (message.senderId !== userId && message.status === "read") {
          await this.messageService.notifyMessageRead(
            message._id,
            chatId,
            message.senderId
          );
        }
      }
    }
  }
}
