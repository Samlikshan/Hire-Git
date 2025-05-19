import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MessageSquare,
  Briefcase,
  Calendar,
  ExternalLink,
  Video,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { io } from "socket.io-client";
import {
  getNotificationsService,
  markAsReadService,
  markAllAsReadService,
} from "@/services/notification";
import { Notification } from "@/types/job";

interface NotificationFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const filters: NotificationFilter[] = [
  {
    id: "all",
    label: "All Notifications",
    icon: <Bell size={18} />,
    color: "bg-gray-500",
  },
  {
    id: "message",
    label: "Messages",
    icon: <MessageSquare size={18} />,
    color: "bg-blue-500",
  },
  {
    id: "job",
    label: "Job Updates",
    icon: <Briefcase size={18} />,
    color: "bg-green-500",
  },
  {
    id: "interview",
    label: "Interviews",
    icon: <Calendar size={18} />,
    color: "bg-purple-500",
  },
];

const ActionButton: React.FC<{ type: string; label: string; url: string }> = ({
  type,
  label,
  url,
}) => {
  const baseClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  switch (type) {
    case "join":
      return (
        <a
          href={url}
          className={`${baseClasses} bg-purple-100 text-purple-700 hover:bg-purple-200`}
          rel="noopener noreferrer"
        >
          <Video size={16} />
          {label}
        </a>
      );
    case "view":
      return (
        <a
          href={url}
          className={`${baseClasses} bg-blue-50 text-blue-700 hover:bg-blue-100`}
        >
          <ExternalLink size={16} />
          {label}
        </a>
      );
    case "reply":
      return (
        <a
          href={url}
          className={`${baseClasses} bg-green-50 text-green-700 hover:bg-green-100`}
        >
          <MessageSquare size={16} />
          {label}
        </a>
      );
    default:
      return null;
  }
};

export const NotificationPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state);
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notificationCounts = useMemo(() => {
    const counts = {
      all: notifications.length,
      message: 0,
      job: 0,
      interview: 0,
    };

    notifications.forEach((notification) => {
      switch (notification.type) {
        case "message":
          counts.message += 1;
          break;
        case "job":
          counts.job += 1;
          break;
        case "interview":
          counts.interview += 1;
          break;
      }
    });

    return counts;
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadService(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user.userData?._id) return;
    try {
      await markAllAsReadService(user.userData._id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  useEffect(() => {
    if (!user.userData?._id) return;

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      socketInstance.emit("identify", user.userData?._id);
    });

    socketInstance.on("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    const fetchNotifications = async () => {
      if (!user || !user.userData) {
        return;
      }
      try {
        const response = await getNotificationsService(user?.userData?._id);
        if (response.data?.notifications) {
          setNotifications(response.data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    return () => {
      socketInstance.disconnect();
    };
  }, [user.userData?._id]);

  const filteredNotifications = notifications.filter(
    (notification) =>
      activeFilter === "all" || notification.type === activeFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Notifications {unreadCount > 0 && `(${unreadCount} new)`}
              </h1>
              <button
                onClick={handleMarkAllAsRead}
                className={`text-sm ${
                  unreadCount > 0
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
            </div>

            <div className="flex overflow-x-auto pb-2 w-full scrollbar-hide">
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeFilter === filter.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {React.cloneElement(filter.icon as React.ReactElement, {
                      className: `${
                        activeFilter === filter.id
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`,
                    })}
                    <span className="font-medium whitespace-nowrap">
                      {filter.label}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activeFilter === filter.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {
                        notificationCounts[
                          filter.id as keyof typeof notificationCounts
                        ]
                      }
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 transition-colors ${
                  !notification.read
                    ? "bg-blue-50/40 hover:bg-blue-50/60"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div
                      className={`p-2 rounded-full ${
                        filters.find((f) => f.id === notification.type)
                          ?.color || "bg-gray-500"
                      }`}
                    >
                      {filters.find((f) => f.id === notification.type)?.icon}
                    </div>
                    {!notification.read && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className={`text-base ${
                            !notification.read
                              ? "font-semibold text-gray-900"
                              : "font-medium text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {notification.job?.title && (
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.job.title}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString()}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-sm ${
                        !notification.read ? "text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {notification.message}
                    </p>

                    {notification.action && (
                      <div className="mt-4">
                        <ActionButton {...notification.action} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No notifications found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
