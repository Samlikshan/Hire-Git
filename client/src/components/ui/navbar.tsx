import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/reducers/userSlice";
import { RootState } from "@/reducers/rootReducer";
import { useEffect, useState } from "react";
import { NotificationDropdown } from "./NotificationDropDown";
import {
  getUnreadNotificationsService,
  markAsReadService,
  markAllAsReadService,
} from "@/services/notification";

import { io } from "socket.io-client";
import { Notification } from "@/types/job";
import { getMessagesService } from "@/services/chat";
import { Chat, Message } from "@/types/Message";
import { MessagesDropdown } from "./Messages";

export default function Navbar() {
  const { userData, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [chats, setChats] = useState<Chat[] | []>([]);
  const [notifications, setNotifications] = useState<Notification[] | []>([]);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

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
    if (!userData?._id) return;
    try {
      await markAllAsReadService(userData._id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  useEffect(() => {
    if (!userData?._id) {
      console.log("No user ID available, not connecting socket");
      return;
    }
    const handleNewMessage = (message: Message) => {
      console.log(message, "new Message from navbar");
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chatId ? { ...chat, lastMessage: message } : chat
        )
      );
    };

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
    console.log("Setting up socket with user ID:", userData?._id);

    // Initialize socket connection
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
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
      socketInstance.emit("identify", userData?._id);
      console.log("Sent identify event with user ID:", userData?._id);
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
    socketInstance?.on("new_message", handleNewMessage);
    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      // setConnected(false);
    });

    socketInstance?.on("chat_created", handleNewChat);

    const fetchNotifications = async () => {
      if (!userData?._id) return;
      try {
        const response = await getUnreadNotificationsService(userData?._id);

        if (response.data?.notifications) {
          setNotifications(response.data.notifications);
        }
        console.log(response, "getNotifications response");
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const fetchMessages = async () => {
      if (!userData._id) return;
      try {
        const response = await getMessagesService();

        console.log(response, "fetchMessages");
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchMessages();
    fetchNotifications();
  }, [userData]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        {/* Logo - Slightly left */}
        <div className="flex items-center -ml-1">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">HireX</span>
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className="mx-auto flex items-center space-x-8">
          <Link
            to="/"
            className="text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className="text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Jobs
          </Link>
          {userData?.role == "company" && (
            <Link
              to="/subscriptions"
              className="text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              Subscriptions
            </Link>
          )}
          <Link
            to="/about"
            className="text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            About Us
          </Link>
        </nav>

        {/* Right Section - Slightly right */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-6 -mr-1">
            {/* Messages */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
              }}
            >
              <Mail className="h-5 w-5 text-gray-700" />
              {chats?.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {chats.length}
                </span>
              )}
            </Button>

            {/* Messages */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessages(false);
                }}
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {notifications?.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {notifications?.length}
                  </span>
                )}
              </Button>
              <div className="relative">
                <MessagesDropdown
                  isOpen={showMessages}
                  onClose={() => setShowMessages(false)}
                  chats={chats}
                  userType={userData?.role as "company" | "candidate"}
                />
              </div>
              <div className="relative">
                <NotificationDropdown
                  notifications={notifications}
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={
                        `${import.meta.env.VITE_S3_PATH}/${
                          userData?.profileImage
                        }`
                        // "https://placehold.co/300x300"
                      }
                      alt={userData?.name}
                    />
                    <AvatarFallback>
                      {userData?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`${import.meta.env.VITE_S3_PATH}/${
                        userData?.profileImage
                      }`}
                      alt={userData?.name}
                    />
                    <AvatarFallback>
                      {userData?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userData?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {userData?.role == "company" && (
                  <Link to="/company">
                    <DropdownMenuItem className="cursor-pointer">
                      Go To Dashboard
                    </DropdownMenuItem>
                  </Link>
                )}
                {userData?.role == "candidate" && (
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      View Profile
                    </DropdownMenuItem>
                  </Link>
                )}
                {userData?.role == "admin" && (
                  <Link to="/admin">
                    <DropdownMenuItem className="cursor-pointer">
                      Go To Dashbaord
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuItem className="cursor-pointer">
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  My Applications
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Saved Jobs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4 -mr-1">
            <Button
              variant="ghost"
              className="text-[15px] font-medium text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              className="rounded-md bg-blue-600 text-[15px] font-medium hover:bg-blue-700"
              asChild
            >
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
