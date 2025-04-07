import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  createNotificaton(notificationData: Notification): Promise<Notification>;
  getNotificatons(candidateId: string): Promise<Notification[] | null>;
}
