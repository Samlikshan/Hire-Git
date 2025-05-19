import { NextFunction, Request, Response } from "express";
import { GetNotificationsUseCase } from "../../../domain/usecases/Candidate/GetNotificationsUseCase";
import { NotificationRepository } from "../../../infrastructure/database/repositories/NotificationRepository";
import { HttpStatus } from "../../../domain/enums/http-status.enum";
import { GetUnReadNotificationsUseCase } from "../../../domain/usecases/Candidate/GetUnreadNotificationsUseCase";

export class NotificationController {
  private notificationRepository = new NotificationRepository();
  private getNotificationsUseCase = new GetNotificationsUseCase(
    this.notificationRepository
  );
  private getUnreadNotificationUseCase = new GetUnReadNotificationsUseCase(
    this.notificationRepository
  );

  getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { candidateId } = req.params;

      const response = await this.getNotificationsUseCase.execute(candidateId);
      res.json({
        message: response.message,
        notifications: response.notifications,
      });
    } catch (error) {
      next(error);
    }
  };
  getUnreadNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { candidateId } = req.params;

      const response = await this.getUnreadNotificationUseCase.execute(
        candidateId
      );
      res.json({
        message: response.message,
        notifications: response.notifications,
      });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationId } = req.params;
      await this.notificationRepository.markAsRead(notificationId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Notification marked as read" });
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      await this.notificationRepository.markAllAsRead(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  };
}
