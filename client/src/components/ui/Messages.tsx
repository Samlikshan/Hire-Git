import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { Chat } from "@/types/Message";
import { Link } from "react-router-dom";
import { getTimeAgo } from "@/lib/utils";
interface MessagesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  userType: "company" | "candidate";
}

export const MessagesDropdown: React.FC<MessagesDropdownProps> = ({
  isOpen,
  onClose,
  chats,
  userType,
}) => {
  const getSenderInfo = (chat: Chat) => {
    const isCompany = userType === "company";
    return {
      name: isCompany
        ? (chat.candidateId as { name: string })?.name
        : (chat.companyId as { name: string })?.name,
      avatar: isCompany
        ? (chat.candidateId as { profileImage: string })?.profileImage
        : (chat.companyId as { logo: string })?.logo,
      company: isCompany ? "" : (chat.companyId as { name: string })?.name,
      role: (chat.jobId as { title: string })?.title,
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Messages
                </h3>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                  {
                    chats.filter((chat) => chat.lastMessage?.status === "sent")
                      .length
                  }{" "}
                  new
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {chats.map((chat) => {
              const sender = getSenderInfo(chat);
              const lastMessage = chat.lastMessage;

              return (
                <Link
                  key={chat._id}
                  to={`/profile/messages`} // Update with your messages route
                  className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors `}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_S3_PATH}/${sender.avatar}`}
                        alt={sender.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {sender.name}
                          </p>
                          <p className="text-xs text-gray-500">{sender.role}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {lastMessage && (
                            <>
                              <span className="text-xs text-gray-400">
                                {getTimeAgo(chat.createdAt)}
                              </span>
                              {/* {!lastMessage.status ? (
                                <Circle
                                  size={8}
                                  className="fill-blue-500 text-blue-500"
                                />
                              ) : (
                                <CheckCheck
                                  size={16}
                                  className="text-gray-400"
                                />
                              )} */}
                            </>
                          )}
                        </div>
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <Link
              to="/profile/messages"
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Open Messages
              <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
