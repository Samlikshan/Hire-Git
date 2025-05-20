// src/components/NotificationDropDownFx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Briefcase,
  MessageSquare,
  Calendar,
  X,
  ChevronRight,
} from "lucide-react";
import { Notification } from "@/types/job";

const NotificationIcon = ({ type }: { type: string }) => {
  const iconProps = { size: 16, className: "text-white" };

  switch (type) {
    case "message":
      return (
        <div className="bg-blue-500 p-2 rounded-full">
          <MessageSquare {...iconProps} />
        </div>
      );
    case "job":
      return (
        <div className="bg-green-500 p-2 rounded-full">
          <Briefcase {...iconProps} />
        </div>
      );
    case "interview":
      return (
        <div className="bg-purple-500 p-2 rounded-full">
          <Calendar {...iconProps} />
        </div>
      );
    default:
      return (
        <div className="bg-gray-500 p-2 rounded-full">
          <Clock {...iconProps} />
        </div>
      );
  }
};

interface NotificationDropdownProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 top-2 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                    {unreadCount} new
                  </span>
                )}
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
            {notifications?.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notification.read ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <NotificationIcon type={notification.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          !notification.read
                            ? "font-medium text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString()}
                        </p>
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification._id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={onMarkAllAsRead}
              className={`text-sm ${
                unreadCount > 0
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
            <button
              className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-1"
              onClick={onClose}
            >
              View all <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
