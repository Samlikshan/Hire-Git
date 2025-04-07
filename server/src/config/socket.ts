// src/config/socket.ts
import { Server, Socket } from "socket.io";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

export class SocketIOProvider {
  private static instance: SocketIOProvider;
  private io: Server | null = null;

  private constructor() {}

  public static getInstance(): SocketIOProvider {
    if (!SocketIOProvider.instance) {
      SocketIOProvider.instance = new SocketIOProvider();
    }
    return SocketIOProvider.instance;
  }

  public initialize(server: any): void {
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
      });
    });

    console.log("Socket.IO initialized successfully");
  }

  private handleAuthentication(socket: Socket): void {
    try {
      // Check if cookies are available in handshake
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) {
        console.log("No cookies in handshake");
        return;
      }

      // Parse cookies
      const parsedCookies = parse(cookies);
      const accessToken = parsedCookies.refreshToken;

      if (!accessToken) {
        console.log("No access token in cookies");
        return;
      }
      // Verify token
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
        id: string;
      };

      // Store user data on socket
      (socket as any).userData = decoded;

      // No need to join room here - client will send 'identify' event
      console.log(`User authenticated via cookie: ${decoded.id}`);
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
