import { INotificationRepository } from "../../repositories/INotificationRepository";

export class GetUnReadNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}
  async execute(candidateId: string) {
    const notifications =
      await this.notificationRepository.getUnreadNotifications(candidateId);

    if (!notifications) {
      return { message: "Falied to fetch notifications", notifications: [] };
    }

    return {
      message: "Notifications fetched successfully",
      notifications: notifications,
    };
  }
}
