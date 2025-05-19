// src/interfaces/routes/chatRoutes.ts
import { Router } from "express";
import { ChatController } from "../controllers/chatController";
import { verifyToken as authMiddleware } from "../middlewares/verifyTokenMiddleware";
import { FileUpload } from "../../utils/multerService";

const router = Router();
const chatController = new ChatController();
const upload = new FileUpload({
  fileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
  fileSizeLimit: 5 * 1024 * 1024, // 5MB
  uploadDir: "chat_uploads",
});
router.post("/", authMiddleware(), chatController.createChat);
router.get("/", authMiddleware(), chatController.getChats);
router.post(
  "/:chatId/messages",
  authMiddleware(),
  upload.uploadFile("file"),
  chatController.sendMessage
);
router.get("/:chatId/messages", authMiddleware(), chatController.getMessages);

router.post(
  "/:chatId/mark-read",
  authMiddleware(),
  chatController.markMessagesAsRead
);
// src/interfaces/routes/chatRoutes.ts
router.get(
  "/:chatId/unread-messages",
  authMiddleware(),
  chatController.getUnreadMessages
);
export default router;
