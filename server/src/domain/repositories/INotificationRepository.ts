import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  createNotificaton(notificationData: Notification): Promise<Notification>;
  getNotificatons(candidateId: string): Promise<Notification[] | null>;
  getUnreadNotifications(candidateId: string): Promise<Notification[] | null>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
