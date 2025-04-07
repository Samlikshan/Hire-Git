import { socketProvider } from "../../config/socket";
import { Notification } from "../../domain/entities/Notification";

export class NotificationService {
  async sendNotification(userId: string, notification: Notification) {
    socketProvider.emitToUser(userId, "notification", notification);
    return true; // Return success
  }
}
