import { NextFunction, Request, Response } from "express";
import { ListApplicantsUseCase } from "../../../domain/usecases/company/job/ListJobApplicants";
import { JobApplicationRepository } from "../../../infrastructure/database/repositories/JobApplicationRepository";

import { ShortListCandidateUseCase } from "../../../domain/usecases/company/job/ShortlistCandidateUseCase";
import { NotificationRepository } from "../../../infrastructure/database/repositories/NotificationRepository";
import { NotificationService } from "../../../infrastructure/services/NotificationService";

export class JobApplicationController {
  private jobApplicationRepository = new JobApplicationRepository();
  private notificatoinRepository = new NotificationRepository();
  private notificationService = new NotificationService();
  private listApplicantsUseCase = new ListApplicantsUseCase(
    this.jobApplicationRepository
  );

  private shortlistApplicantUseCase = new ShortListCandidateUseCase(
    this.jobApplicationRepository,
    this.notificatoinRepository,
    this.notificationService
  );
  listApplicants = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      const response = await this.listApplicantsUseCase.execute(jobId);
      res.json({ message: response.message, applicants: response.applicants });
    } catch (error) {
      next(error);
    }
  };
  shortlistApplicant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { applicationId } = req.params;

      const response = await this.shortlistApplicantUseCase.execute(
        applicationId
      );

      res.json({ message: response?.message });
    } catch (error) {
      next(error);
    }
  };
}
