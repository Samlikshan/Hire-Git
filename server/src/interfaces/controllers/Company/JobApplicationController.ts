import { NextFunction, Request, Response } from "express";
import { ListApplicantsUseCase } from "../../../domain/usecases/company/job/ListJobApplicants";
import { JobApplicationRepository } from "../../../infrastructure/database/repositories/JobApplicationRepository";
import { NotificationRepository } from "../../../infrastructure/database/repositories/NotificationRepository";
import { ShortListCandidateUseCase } from "../../../domain/usecases/company/job/ShortlistCandidateUseCase";
import { NotificationService } from "../../../infrastructure/services/NotificationService";
import { ChatRepository } from "../../../infrastructure/database/repositories/ChatRepository";
import { MessageService } from "../../../infrastructure/services/MessageService";
import { CreateChatUseCase } from "../../../domain/usecases/Chat/CreateChatUseCase";
import { ScheduleInterviewUseCase } from "../../../domain/usecases/company/job/ScheduleInterviewUseCase";
import { InterviewRepository } from "../../../infrastructure/database/repositories/InterviewRepository";

export class JobApplicationController {
  private jobApplicationRepository = new JobApplicationRepository();
  private notificatoinRepository = new NotificationRepository();
  private notificationService = new NotificationService();
  private messageService = new MessageService();
  private interviewRepository = new InterviewRepository();

  //useCase
  private listApplicantsUseCase = new ListApplicantsUseCase(
    this.jobApplicationRepository
  );
  private chatRepository = new ChatRepository();
  private createChatUseCase = new CreateChatUseCase(
    this.chatRepository,
    this.messageService
  );
  private shortlistApplicantUseCase = new ShortListCandidateUseCase(
    this.jobApplicationRepository,
    this.notificatoinRepository,
    this.notificationService,
    this.messageService,
    this.createChatUseCase
  );
  private scheduleInterviewUseCase = new ScheduleInterviewUseCase(
    this.jobApplicationRepository,
    this.interviewRepository,
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

  scheduleInterview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { applicationId, date, time, duration, timeZone, round, notes } =
        req.body;

      const response = await this.scheduleInterviewUseCase.execute(
        applicationId,
        date,
        time,
        duration,
        timeZone,
        round,
        notes
      );
      res.json({ message: response?.message });
    } catch (error) {
      next(error);
    }
  };
}
