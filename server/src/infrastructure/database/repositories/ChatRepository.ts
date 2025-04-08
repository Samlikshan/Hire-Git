import { Chat } from "../../../domain/entities/Chat";
import { Message } from "../../../domain/entities/Message";
import { IChatRepository } from "../../../domain/repositories/IChatRepository";
import { chatModel } from "../models/chatModel";

export class ChatRepository implements IChatRepository {
  async create(chat: Omit<Chat, "_id">): Promise<Chat> {
    return chatModel.create(chat);
  }

  async findByParticipants(
    companyId: string,
    candidateId: string,
    jobId: string
  ): Promise<Chat | null> {
    return chatModel
      .findOne({ companyId, candidateId, jobId })
      .populate("companyId jobId");
  }

  async findById(id: string): Promise<Chat | null> {
    return chatModel.findById(id);
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return chatModel.find({ candidateId: userId }).populate("companyId jobId");
  }

  async getCompanyChats(companyId: string): Promise<Chat[]> {
    return chatModel.find({ companyId }).populate("candidateId jobId");
  }

  async updateLastMessage(
    chatId: string,
    message: Message
  ): Promise<Chat | null> {
    return chatModel.findByIdAndUpdate(
      chatId,
      { $set: { lastMessage: message, updatedAt: new Date() } },
      { new: true }
    );
  }
}
