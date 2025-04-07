import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Briefcase,
  MessageSquare,
  Calendar,
  X,
  ChevronRight,
  // Video,
  // ExternalLink,
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

// const ActionButton: React.FC<{ type: string; url: string }> = ({
//   type,
//   url,
// }) => {
//   const baseClasses =
//     "mt-2 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors";

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
//           Join Interview
//         </a>
//       );
//     case "view":
//       return (
//         <a
//           href={url}
//           className={`${baseClasses} bg-blue-50 text-blue-700 hover:bg-blue-100`}
//         >
//           <ExternalLink size={16} />
//           View Details
//         </a>
//       );
//     case "reply":
//       return (
//         <a
//           href={url}
//           className={`${baseClasses} bg-green-50 text-green-700 hover:bg-green-100`}
//         >
//           <MessageSquare size={16} />
//           Reply
//         </a>
//       );
//     default:
//       return null;
//   }
// };

interface NotificationDropdownProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
}) => {
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
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                  {notifications?.filter((n) => !n.read).length} new
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
            {notifications?.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notification.read ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <NotificationIcon type={notification.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-gray-900 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {notification.time}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.message}
                    </p>

                    {/* {notification.action.type && notification.action.url && (
                      <ActionButton
                        type={notification.action.type}
                        url={notification.action.url}
                      />
                    )} */}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View All Notifications
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
