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
  async getNotificatons(candidateId: string): Promise<Notification[] | null> {
    return NotificationModel.find({ candidate: candidateId, read: false })
      .populate({ path: "job", populate: { path: "company" } })
      .sort({
        timeStamp: -1,
      });
  }
}
