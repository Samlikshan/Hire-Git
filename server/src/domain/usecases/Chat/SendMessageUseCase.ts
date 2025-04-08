// src/domain/useCases/chat/SendMessageUseCase.ts
import { IMessageRepository } from "../../repositories/IMessageRepository";
import { IChatRepository } from "../../repositories/IChatRepository";
import { MessageService } from "../../../infrastructure/services/MessageService";
import { Message } from "../../entities/Message";

export class SendMessageUseCase {
  constructor(
    private messageRepository: IMessageRepository,
    private chatRepository: IChatRepository,
    private messageService: MessageService
  ) {}

  async execute(
    chatId: string,
    senderType: "company" | "candidate",
    senderId: string,
    content: string,
    receiverId: string
  ): Promise<Message> {
    const message = await this.messageRepository.create({
      chatId,
      senderType,
      senderId,
      content,
      status: "sent",
    });

    await this.chatRepository.updateLastMessage(chatId, message);
    await this.messageService.sendMessage(message);
    return message;
  }
}
