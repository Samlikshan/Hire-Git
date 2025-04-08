export interface Chat {
  _id: string;
  companyId: string | { name: string; logo: string };
  candidateId: string | { name: string; profileImage: string };
  jobId: string | { title: string };
  lastMessage?: Message;
  createdAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  senderType: "company" | "candidate";
  senderId: string;
  content: string;
  status: "sent" | "delivered" | "read";
  createdAt: string;
}
