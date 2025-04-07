import { NextFunction, Request, Response } from "express";
import { GetNotificationsUseCase } from "../../../domain/usecases/Candidate/GetNotificationsUseCase";
import { NotificationRepository } from "../../../infrastructure/database/repositories/NotificationRepository";
import { HttpStatus } from "../../../domain/enums/http-status.enum";

export class NotificationController {
  private notificationRepository = new NotificationRepository();
  private getNotificationsUseCase = new GetNotificationsUseCase(
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
}
