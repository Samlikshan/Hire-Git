import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MessageSquare,
  Briefcase,
  Calendar,
  Clock,
  // CheckCircle,
  // Filter,
  // Search,
  // Video,
  // ExternalLink,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { io } from "socket.io-client";

import { getNotificationsService } from "@/services/notification";
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
  {
    id: "reminder",
    label: "Reminders",
    icon: <Clock size={18} />,
    color: "bg-orange-500",
  },
];

// const ActionButton: React.FC<{ type: string; label: string; url: string }> = ({
//   type,
//   label,
//   url,
// }) => {
//   const baseClasses =
//     "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors";

//   switch (type) {
//     case "join":
//       return (
//         <a
//           href={url}
//           className={`${baseClasses} bg-purple-100 text-purple-700 hover:bg-purple-200`}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Video size={16} />
//           {label}
//         </a>
//       );
//     case "view":
//       return (
//         <a
//           href={url}
//           className={`${baseClasses} bg-blue-50 text-blue-700 hover:bg-blue-100`}
//         >
//           <ExternalLink size={16} />
//           {label}
//         </a>
//       );
//     case "reply":
//       return (
//         <a
//           href={url}
//           className={`${baseClasses} bg-green-50 text-green-700 hover:bg-green-100`}
//         >
//           <MessageSquare size={16} />
//           {label}
//         </a>
//       );
//     default:
//       return null;
//   }
// };

export const NotificationPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state);
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notification[] | []>([]);
  const notificationCounts = useMemo(() => {
    const counts = {
      all: notifications.length,
      message: 0,
      job: 0,
      interview: 0,
      reminder: 0,
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
        case "reminder":
          counts.reminder += 1;
          break;
      }
    });

    return counts;
  }, [notifications]);

  //   const [searchQuery, setSearchQuery] = useState("");
  // const [socket, setSocket] = useState(null);
  // const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!user.userData?._id) {
      console.log("No user ID available, not connecting socket");
      return;
    }

    console.log("Setting up socket with user ID:", user.userData?._id);

    // Initialize socket connection
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // Socket event handlers
    socketInstance.on("connect", () => {
      console.log(
        "Socket connected successfully! Socket ID:",
        socketInstance.id
      );
      // setConnected(true);

      // Send user ID after successful connection
      socketInstance.emit("identify", user.userData?._id);
      console.log("Sent identify event with user ID:", user.userData?._id);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      // setConnected(false);
    });

    // Listen specifically for the "notification" event
    socketInstance.on("notification", (data) => {
      console.log("📣 Notification received:", data);
      setNotifications((prev) => [data, ...prev]);
      // You could also show a toast notification here
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      // setConnected(false);
    });

    // setSocket(socketInstance);

    // Fetch existing notifications on load
    const fetchNotifications = async () => {
      try {
        if (!user.userData?._id) return;
        const response = await getNotificationsService(user.userData?._id);

        if (response.data?.notifications) {
          setNotifications(response.data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up socket connection");
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user.userData?._id]);
  const filteredNotifications = notifications.filter(
    (notification) =>
      activeFilter === "all" || notification.type === activeFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Notifications
              </h1>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Mark all as read
              </button>
            </div>

            {/* Tabs */}
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

            {/* Search */}
            {/* <div className="flex items-center gap-4 mt-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2.5 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={20} />
              </button>
            </div> */}
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.read ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      filters.find((f) => f.id === notification.type)?.color ||
                      "bg-gray-500"
                    }`}
                  >
                    {filters.find((f) => f.id === notification.type)?.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        {(notification.company || notification.job.title) && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {notification.company?.name}{" "}
                            {notification.job.title &&
                              `• ${notification.job.title}`}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {notification.message}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      {/* {notification.action && (
                        <ActionButton {...notification.action} />
                      )} */}
                      <div className="flex items-center gap-3">
                        {/* {!notification.read ? (
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Mark as read
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <CheckCircle size={14} />
                            Read
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
