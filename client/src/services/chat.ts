import { Chat } from "@/types/Message";
import axiosInstance from "./axiosInstance";

export const getMessagesService = async () => {
  const response = await axiosInstance.get<Chat[]>("/chat");
  return response;
};
