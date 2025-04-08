import { Message } from "../../../domain/entities/Message";
import { IMessageRepository } from "../../../domain/repositories/IMessageRepository";
import { messageModel } from "../models/messageModel";

export class MessageRepository implements IMessageRepository {
  async create(message: Omit<Message, "id" | "timestamp">): Promise<Message> {
    return messageModel.create({ ...message, timestamp: new Date() });
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    return messageModel.find({ chatId }).sort("timestamp");
  }

  async updateStatus(
    messageId: string,
    status: "delivered" | "read"
  ): Promise<Message | null> {
    return messageModel.findByIdAndUpdate(messageId, { status }, { new: true });
  }
}
