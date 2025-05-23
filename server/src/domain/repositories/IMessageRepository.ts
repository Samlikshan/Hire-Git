import { Message } from "../entities/Message";

export interface IMessageRepository {
  create(message: Omit<Message, "_id" | "timestamp">): Promise<Message>;
  getChatMessages(chatId: string): Promise<Message[]>;
  updateStatus(
    messageId: string,
    status: "delivered" | "read"
  ): Promise<Message | null>;
  markMessagesAsRead(chatId: string, userId: string): Promise<void>;
  getUnreadMessages(chatId: string, userId: string): Promise<Message[]>;
}
