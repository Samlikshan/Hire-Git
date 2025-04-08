// src/domain/repositories/IChatRepository.ts
import { Chat } from "../entities/Chat";
import { Message } from "../entities/Message";

export interface IChatRepository {
  create(chat: Omit<Chat, "_id" | "createdAt" | "updatedAt">): Promise<Chat>;
  findByParticipants(
    companyId: string,
    candidateId: string,
    jobId: string
  ): Promise<Chat | null>;
  findById(id: string): Promise<Chat | null>;
  getUserChats(userId: string): Promise<Chat[]>;
  getCompanyChats(companyId: string): Promise<Chat[]>;
  updateLastMessage(chatId: string, message: Message): Promise<Chat | null>;
}
