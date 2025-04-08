// src/domain/useCases/chat/CreateChatUseCase.ts
import { IChatRepository } from "../../repositories/IChatRepository";
import { MessageService } from "../../../infrastructure/services/MessageService";
import { Chat } from "../../entities/Chat";
import { HttpException } from "../../enums/http-exception";
import { HttpStatus } from "../../enums/http-status.enum";

export class CreateChatUseCase {
  constructor(
    private chatRepository: IChatRepository,
    private messageService: MessageService
  ) {}

  async execute(
    companyId: string,
    candidateId: string,
    jobId: string
  ): Promise<Chat> {
    const existingChat = await this.chatRepository.findByParticipants(
      companyId,
      candidateId,
      jobId
    );
    if (existingChat) return existingChat;

    await this.chatRepository.create({
      companyId,
      candidateId,
      jobId,
      messages: [],
    });
    const newChat = await this.chatRepository.findByParticipants(
      companyId,
      candidateId,
      jobId
    );
    if (!newChat) {
      throw new HttpException("Chat creating failed", HttpStatus.BAD_REQUEST);
    }
    await this.messageService.notifyChatCreated(newChat);
    return newChat;
  }
}
