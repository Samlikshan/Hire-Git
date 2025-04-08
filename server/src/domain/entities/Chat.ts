import { Message } from "./Message";

export class Chat {
  constructor(
    public _id: string,
    public companyId: string,
    public candidateId: string,
    public jobId: string,
    public messages: Message[] = [],
    public lastMessage?: Message,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
