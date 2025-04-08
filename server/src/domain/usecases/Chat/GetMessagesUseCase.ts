import { Message } from "../../entities/Message";
import { IMessageRepository } from "../../repositories/IMessageRepository";

export class GetMessagesUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(chatId: string): Promise<Message[]> {
    return this.messageRepository.getChatMessages(chatId);
  }
}
