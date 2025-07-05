"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/interfaces/routes/chatRoutes.ts
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const multerService_1 = require("../../utils/multerService");
const router = (0, express_1.Router)();
const chatController = new chatController_1.ChatController();
const upload = new multerService_1.FileUpload({
    fileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    uploadDir: "chat_uploads",
});
router.post("/", (0, verifyTokenMiddleware_1.verifyToken)(), chatController.createChat);
router.get("/", (0, verifyTokenMiddleware_1.verifyToken)(), chatController.getChats);
router.post("/:chatId/messages", (0, verifyTokenMiddleware_1.verifyToken)(), upload.uploadFile("file"), chatController.sendMessage);
router.get("/:chatId/messages", (0, verifyTokenMiddleware_1.verifyToken)(), chatController.getMessages);
router.post("/:chatId/mark-read", (0, verifyTokenMiddleware_1.verifyToken)(), chatController.markMessagesAsRead);
// src/interfaces/routes/chatRoutes.ts
router.get("/:chatId/unread-messages", (0, verifyTokenMiddleware_1.verifyToken)(), chatController.getUnreadMessages);
exports.default = router;
