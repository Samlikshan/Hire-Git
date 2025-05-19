// src/domain/usecases/Chat/GetUnreadMessagesUseCase.ts
import { IMessageRepository } from "../../repositories/IMessageRepository";
import { Message } from "../../entities/Message";
import { HttpException } from "../../enums/http-exception";
import { HttpStatus } from "../../enums/http-status.enum";

export class GetUnreadMessagesUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(chatId: string, userId: string): Promise<Message[]> {
    if (!chatId || !userId) {
      throw new HttpException(
        "Missing required fields",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.messageRepository.getUnreadMessages(chatId, userId);
  }
}
