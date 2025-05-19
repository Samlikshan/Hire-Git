import { populate } from "dotenv";
import { Notification } from "../../../domain/entities/Notification";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";
import { NotificationModel } from "../models/notificationModel";

export class NotificationRepository implements INotificationRepository {
  async createNotificaton(
    notificationData: Notification
  ): Promise<Notification> {
    return NotificationModel.create(notificationData);
  }

  async getUnreadNotifications(
    candidateId: string
  ): Promise<Notification[] | null> {
    return NotificationModel.find({ candidate: candidateId, read: false })
      .populate({ path: "job", populate: { path: "company" } })
      .sort({
        timeStamp: -1,
      });
  }

  async getNotificatons(candidateId: string): Promise<Notification[] | null> {
    return NotificationModel.find({ candidate: candidateId })
      .populate({ path: "job", populate: { path: "company" } })
      .sort({
        timeStamp: -1,
      });
  }

  async markAsRead(id: string): Promise<void> {
    await NotificationModel.findByIdAndUpdate(id, { read: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { candidate: userId, read: false },
      { $set: { read: true } }
    );
  }
}
