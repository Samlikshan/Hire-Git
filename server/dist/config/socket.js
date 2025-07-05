"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketProvider = exports.SocketIOProvider = void 0;
// src/config/socket.ts
const socket_io_1 = require("socket.io");
const cookie_1 = require("cookie");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class SocketIOProvider {
    constructor() {
        this.io = null;
        this.onlineUsers = new Map(); // Track user connections count
    }
    static getInstance() {
        if (!SocketIOProvider.instance) {
            SocketIOProvider.instance = new SocketIOProvider();
        }
        return SocketIOProvider.instance;
    }
    initialize(server) {
        if (this.io)
            return; // Already initialized
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: [process.env.CLIENT_URL], // Match your frontend origin
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
                var _a, _b;
                console.log("Client disconnected:", socket.id);
                const userId = (_a = socket.userData) === null || _a === void 0 ? void 0 : _a.id;
                if (userId) {
                    const currentCount = this.onlineUsers.get(userId) || 0;
                    if (currentCount > 0) {
                        const newCount = currentCount - 1;
                        this.onlineUsers.set(userId, newCount);
                        if (newCount === 0) {
                            (_b = this.io) === null || _b === void 0 ? void 0 : _b.emit("user_offline", userId);
                            this.onlineUsers.delete(userId);
                        }
                    }
                }
            });
        });
        console.log("Socket.IO initialized successfully");
    }
    // src/config/socket.ts
    handleAuthentication(socket) {
        var _a;
        try {
            const cookies = socket.handshake.headers.cookie;
            if (!cookies) {
                console.log("No cookies in handshake");
                return;
            }
            const parsedCookies = (0, cookie_1.parse)(cookies);
            const accessToken = parsedCookies.accessToken; // Use accessToken
            if (!accessToken) {
                console.log("No access token in cookies");
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
            socket.userData = decoded;
            const userId = decoded.id;
            const currentCount = this.onlineUsers.get(userId) || 0;
            this.onlineUsers.set(userId, currentCount + 1);
            if (currentCount === 0) {
                (_a = this.io) === null || _a === void 0 ? void 0 : _a.emit("user_online", userId);
            }
            socket.join(`user_${userId}`);
            console.log(`User ${userId} authenticated`);
            const onlineUserIds = Array.from(this.onlineUsers.keys());
            socket.emit("online_users", onlineUserIds);
        }
        catch (error) {
            console.error("Cookie authentication error:", error);
        }
    }
    emitToUser(userId, event, payload) {
        if (!this.io) {
            console.error("Socket.IO not initialized");
            return;
        }
        // console.log(`Emitting to user_${userId}:`, event, payload);
        this.io.to(`user_${userId}`).emit(event, payload);
    }
    emitToAll(event, payload) {
        if (!this.io) {
            console.error("Socket.IO not initialized");
            return;
        }
        console.log(`Emitting to all:`, event, payload);
        this.io.emit(event, payload);
    }
    getIO() {
        return this.io;
    }
}
exports.SocketIOProvider = SocketIOProvider;
// Export a singleton instance
exports.socketProvider = SocketIOProvider.getInstance();
