// src/domain/entities/Message.ts
export class Message {
  constructor(
    public _id: string,
    public chatId: string,
    public senderType: "company" | "candidate",
    public senderId: string,
    public content: string,
    public status: "sent" | "delivered" | "read" = "sent",
    public type: "text" | "image" | "file",
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
