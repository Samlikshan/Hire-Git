// src/config/socket.ts
import { Server, Socket } from "socket.io";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import http from "http";
export class SocketIOProvider {
  private static instance: SocketIOProvider;
  private io: Server | null = null;
  private onlineUsers = new Map<string, number>(); // Track user connections count

  private constructor() {}

  public static getInstance(): SocketIOProvider {
    if (!SocketIOProvider.instance) {
      SocketIOProvider.instance = new SocketIOProvider();
    }
    return SocketIOProvider.instance;
  }

  public initialize(server: http.Server): void {
    if (this.io) return; // Already initialized

    this.io = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"], // Match your frontend origin
        methods: ["GET", "POST"],
        credentials: true, // Important for cookies
      },
      path: "/socket.io/",
      transports: ["polling", "websocket"],
      // Enable cookie handling
      allowRequest: (req, callback) => {
        // Allow all requests - we'll authenticate after connection
        callback(null, true);
      },
    });

    // Setup connection handler
    this.io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Handle authentication after connection
      this.handleAuthentication(socket);

      socket.on("join_chat", (chatId) => {
        socket.join(`chat_${chatId}`);
      });

      socket.on("identify", (userId) => {
        if (userId) {
          console.log(`Client ${socket.id} identified as user ${userId}`);
          socket.join(`user_${userId}`);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        const userId = (socket as any).userData?.id;

        if (userId) {
          const currentCount = this.onlineUsers.get(userId) || 0;
          if (currentCount > 0) {
            const newCount = currentCount - 1;
            this.onlineUsers.set(userId, newCount);

            if (newCount === 0) {
              this.io?.emit("user_offline", userId);
              this.onlineUsers.delete(userId);
            }
          }
        }
      });
    });

    console.log("Socket.IO initialized successfully");
  }

  // src/config/socket.ts
  private handleAuthentication(socket: Socket): void {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) {
        console.log("No cookies in handshake");
        return;
      }

      const parsedCookies = parse(cookies);
      const accessToken = parsedCookies.accessToken; // Use accessToken
      if (!accessToken) {
        console.log("No access token in cookies");
        return;
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
        id: string;
      };
      (socket as any).userData = decoded;

      const userId = decoded.id;
      const currentCount = this.onlineUsers.get(userId) || 0;
      this.onlineUsers.set(userId, currentCount + 1);
      if (currentCount === 0) {
        this.io?.emit("user_online", userId);
      }
      socket.join(`user_${userId}`);
      console.log(`User ${userId} authenticated`);

      const onlineUserIds = Array.from(this.onlineUsers.keys());
      socket.emit("online_users", onlineUserIds);
    } catch (error) {
      console.error("Cookie authentication error:", error);
    }
  }

  public emitToUser(userId: string, event: string, payload: unknown): void {
    if (!this.io) {
      console.error("Socket.IO not initialized");
      return;
    }

    // console.log(`Emitting to user_${userId}:`, event, payload);
    this.io.to(`user_${userId}`).emit(event, payload);
  }

  public emitToAll(event: string, payload: unknown): void {
    if (!this.io) {
      console.error("Socket.IO not initialized");
      return;
    }

    console.log(`Emitting to all:`, event, payload);
    this.io.emit(event, payload);
  }

  public getIO(): Server | null {
    return this.io;
  }
}

// Export a singleton instance
export const socketProvider = SocketIOProvider.getInstance();
