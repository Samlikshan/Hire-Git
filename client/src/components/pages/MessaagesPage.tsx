import React, { useEffect, useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Loader2,
  CheckCheck,
  Phone,
  Video,
  Smile,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import axios from "axios";
import { io } from "socket.io-client";
import { Chat, Message } from "@/types/Message";
import { getMessagesService } from "@/services/chat";

interface ChatProps {
  userType: "company" | "candidate";
}

export const MessagesPage: React.FC<ChatProps> = ({
  userType = "candidate",
}) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const [chats, setChats] = useState<Chat[]>([]);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!userData?._id) {
      console.log("No user ID available, not connecting socket");
      return;
    }
    const handleNewMessage = (message: Message) => {
      console.log(message);
      setMessages((prev) => [...prev, message]);
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chatId ? { ...chat, lastMessage: message } : chat
        )
      );
    };
    console.log("Setting up socket with user ID:", userData?._id);

    // Initialize socket connection
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log(
        "Socket connected successfully! Socket ID:",
        socketInstance.id
      );
      // setConnected(true);

      // Send user ID after successful connection
      socketInstance.emit("identify", userData?._id);
      console.log("Sent identify event with user ID:", userData?._id);
    });
    const handleNewChat = (chat: Chat) => {
      console.log("New chat received:", chat);
      setChats((prev) => {
        console.log("Previous chats:", prev);
        // Prevent duplicates
        if (!prev.some((c) => c._id === chat._id)) {
          return [...prev, chat];
        }
        return prev;
      });
    };

    socketInstance?.on("chat_created", handleNewChat);
    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      // setConnected(false);
    });

    socketInstance?.on("new_message", handleNewMessage);
    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      // setConnected(false);
    });
  }, []);
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getMessagesService();
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChats([]); // Ensure we fall back to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userType]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !userData || !userData._id)
      return;

    const tempId = Date.now().toString();
    const newMessage: Message = {
      _id: tempId,
      chatId: selectedChat._id,
      senderType: userType,
      senderId: userData._id,
      content: messageInput.trim(),
      status: "sent",
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");

    try {
      setIsSending(true);
      const { data } = await axios.post(
        `http://localhost:3000/api/chat/${selectedChat._id}/messages`,
        {
          senderType: userType,
          senderId: userData._id,
          content: messageInput.trim(),
        },
        { withCredentials: true }
      );

      // Replace optimistic message with server response
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? data : msg))
      );
    } catch (error) {
      console.error("Message send failed:", error);
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/chat/${selectedChat._id}/messages`,
          { withCredentials: true }
        );
        setMessages(response.data);
        socketInstance?.emit("join_chat", selectedChat._id);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    return () => {
      socketInstance?.emit("leave_chat", selectedChat._id);
    };
  }, [selectedChat]);
  const getChatDisplayData = (chat: Chat) => {
    const isCompanyView = userType === "company";
    return {
      id: chat._id,
      name: isCompanyView
        ? (chat.candidateId as { name: string }).name
        : (chat.companyId as { name: string }).name, // Replace with actual data from API
      avatar: isCompanyView
        ? (chat.candidateId as { profileImage: string }).profileImage
        : (chat.companyId as { logo: string }).logo,
      role: (chat.jobId as { title: string }).title, // Replace with actual job title
      lastActive: new Date(chat.createdAt).toLocaleDateString(),
      isOnline: false,
      lastMessage: chat.lastMessage?.content,
    };
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading chats...</div>;
  }

  return (
    <div className="h-screen bg-white flex rounded-lg">
      {/* Chat List */}
      <div
        className={`w-full md:w-80 border-r border-gray-200 flex flex-col bg-white ${
          showMobileChat ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 rounded-lg">
          {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2> */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={`Search ${
                  userType === "company" ? "candidates" : "companies"
                }...`}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2.5 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {Array.isArray(chats) &&
              chats.map((chat) => {
                const user = getChatDisplayData(chat);
                return (
                  <motion.button
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setShowMobileChat(true);
                    }}
                    className={`w-full p-3 flex items-start gap-3 rounded-xl transition-all duration-200 ${
                      selectedChat?._id === chat._id
                        ? "bg-blue-50 border border-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_S3_PATH}/${user.avatar}`}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0">
                        <div
                          className={`w-3 h-3 rounded-full border-2 border-white ${
                            user.isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {user.lastActive}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {user.lastMessage}
                      </p>
                      {/* {user?.unreadCount && user?.unreadCount > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        {user?.unreadCount} new
                      </span>
                    )} */}
                    </div>
                  </motion.button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <AnimatePresence>
        {selectedChat ? (
          <motion.div
            className={`flex-1 flex flex-col bg-gray-50 ${
              !showMobileChat ? "hidden md:flex" : "flex"
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <img
                    src={`${import.meta.env.VITE_S3_PATH}/${
                      getChatDisplayData(selectedChat).avatar
                    }`}
                    alt={getChatDisplayData(selectedChat).name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {getChatDisplayData(selectedChat).name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {getChatDisplayData(selectedChat).role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.senderId === userData?._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {msg.senderId !== userData?._id &&
                    index > 0 &&
                    messages[index - 1].senderId !== msg.senderId && (
                      <img
                        src={`${import.meta.env.VITE_S3_PATH}/${
                          getChatDisplayData(selectedChat).avatar
                        }`}
                        alt={getChatDisplayData(selectedChat).name}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                    )}
                  <div
                    className={`max-w-[70%] flex flex-col ${
                      msg.senderId === userData?._id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl shadow-sm ${
                        msg.senderId === userData?._id
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.senderId === userData?._id && (
                        <span className="text-gray-400">
                          {msg.status === "sent" && <CheckCheck size={12} />}
                          {msg.status === "delivered" && (
                            <CheckCheck size={12} />
                          )}
                          {msg.status === "read" && (
                            <CheckCheck size={12} className="text-blue-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-gray-50 rounded-2xl p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
                      <ImageIcon size={20} />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
                      <Paperclip size={20} />
                    </button>
                  </div>
                  <div className="flex items-end gap-2">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent resize-none outline-none text-gray-700 placeholder-gray-500 text-sm min-h-[40px] max-h-[120px]"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <button className="p-1.5 text-gray-500 hover:text-gray-700">
                      <Smile size={20} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSending}
                  className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                No chat selected
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Select a {userType === "company" ? "candidate" : "company"} to
                start chatting
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
