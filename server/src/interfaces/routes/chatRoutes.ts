// src/interfaces/routes/chatRoutes.ts
import { Router } from "express";
import { ChatController } from "../controllers/chatController";
import { verifyToken as authMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();
const chatController = new ChatController();

router.post("/", authMiddleware(), chatController.createChat);
router.get("/", authMiddleware(), chatController.getChats);
router.post("/:chatId/messages", authMiddleware(), chatController.sendMessage);
router.get("/:chatId/messages", authMiddleware(), chatController.getMessages);
export default router;
