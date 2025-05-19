// src/infrastructure/services/MessageService.ts

import { socketProvider } from "../../config/socket";
import { Chat } from "../../domain/entities/Chat";
import { Message } from "../../domain/entities/Message";
import { chatModel } from "../database/models/chatModel";

export class MessageService {
  async notifyChatCreated(chat: Chat): Promise<boolean> {
    // Notify both participants
    socketProvider.emitToUser(chat.companyId.toString(), "chat_created", chat);
    socketProvider.emitToUser(
      chat.candidateId.toString(),
      "chat_created",
      chat
    );
    return true;
  }

  async sendMessage(message: Message): Promise<boolean> {
    // Get receiver ID based on sender type
    const chat = await chatModel.findById(message.chatId);
    if (!chat) return false;

    const receiverId =
      message.senderType === "company" ? chat.candidateId : chat.companyId;
    socketProvider.emitToUser(receiverId.toString(), "new_message", message);
    return true;
  }

  // src/infrastructure/services/MessageService.ts
  async notifyMessageRead(
    messageId: string,
    chatId: string,
    senderId: string
  ): Promise<boolean> {
    const chat = await chatModel.findById(chatId);
    if (!chat) return false;

    socketProvider.emitToUser(senderId.toString(), "message_read", {
      messageId,
      chatId,
    });
    return true;
  }
}
