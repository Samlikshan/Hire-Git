import { Chat } from "../../entities/Chat";
import { IChatRepository } from "../../repositories/IChatRepository";

export class GetChatsUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(
    userId: string,
    userType: "company" | "candidate" | "admin"
  ): Promise<Chat[]> {
    return userType === "company"
      ? this.chatRepository.getCompanyChats(userId)
      : this.chatRepository.getUserChats(userId);
  }
}
