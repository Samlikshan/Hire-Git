import { NextFunction, Request, Response } from "express";
import { ListInterviewsUsecase } from "../../../domain/usecases/company/job/ListInterviewsUseCase";
import { InterviewRepository } from "../../../infrastructure/database/repositories/InterviewRepository";
import { EvaluateCandidateUseCase } from "../../../domain/usecases/company/Interview/EvaluateCandidateUseCase";
import { ListJobHistoryUseCase } from "../../../domain/usecases/Candidate/Interview/ListJobHistoryUseCase";
import { InProgressUsecase } from "../../../domain/usecases/company/job/InProgressUseCase";
import { HireCandidateUseCase } from "../../../domain/usecases/company/Interview/HireCandidateUseCase";
import { RejectCandidateUseCase } from "../../../domain/usecases/company/Interview/RejectCandidateUseCase";
import { NotificationService } from "../../../infrastructure/services/NotificationService";
import { AcceptOfferLetter } from "../../../domain/usecases/Candidate/Job/AcceptOfferLetterUseCase";
import { RejectOfferLetter } from "../../../domain/usecases/Candidate/Job/RejectOfferLetterUseCase";
import { ValidateRoomAccessUsecase } from "../../../domain/usecases/company/ValidateRoomAccessUseCase";

export class InterviewController {
  private interivewRepository = new InterviewRepository();
  private notificatoinService = new NotificationService();
  //userCases
  private listInterviesUseCase = new ListInterviewsUsecase(
    this.interivewRepository
  );

  private evaluateCandidateUseCase = new EvaluateCandidateUseCase(
    this.interivewRepository
  );

  private listJobHistoryUseCase = new ListJobHistoryUseCase(
    this.interivewRepository
  );

  private inProgressUsecase = new InProgressUsecase(this.interivewRepository);

  private hireCandidateUseCase = new HireCandidateUseCase(
    this.interivewRepository,
    this.notificatoinService
  );

  private rejectCandidateUseCase = new RejectCandidateUseCase(
    this.interivewRepository,
    this.notificatoinService
  );

  private acceptOfferLetterUseCase = new AcceptOfferLetter(
    this.interivewRepository
  );

  private rejectOfferLetterUseCase = new RejectOfferLetter(
    this.interivewRepository
  );

  private validateRoomAccessUseCase = new ValidateRoomAccessUsecase(
    this.interivewRepository
  );

  listInterviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      const response = await this.listInterviesUseCase.execute(jobId);
      res.json({
        interviews: response,
        messages: "Interviews fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  validateRoomAccess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = req.params;
      const user = req.user;
      const response = await this.validateRoomAccessUseCase.execute(
        roomId,
        user?.id!,
        user?.role
      );
      res.json(response);
    } catch (error) {
      console.log(error, "error");
      next(error);
    }
  };
  evaluate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { completedAt, ratings, recommendation, roomID, notes } = req.body;
      const response = await this.evaluateCandidateUseCase.execute({
        completedAt,
        ratings,
        recommendation,
        roomID,
        notes,
      });
      res.json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };
  listJobHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { candidateId } = req.body;
      const response = await this.listJobHistoryUseCase.execute(candidateId);
      res.json({ message: response.message, jobHistory: response.jobHistory });
    } catch (error) {
      next(error);
    }
  };

  listInProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      const response = await this.inProgressUsecase.execute(jobId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  hire = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { interviewId } = req.params;
      const offerLetter = req.file
        ? (req.file as Express.MulterS3.File).key
        : req.body.key;

      console.log(interviewId, offerLetter);
      const response = await this.hireCandidateUseCase.execute(
        interviewId,
        offerLetter
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { interviewId } = req.params;
      const { rejectionReason } = req.body;
      const response = await this.rejectCandidateUseCase.execute(
        interviewId,
        rejectionReason
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  acceptOfferLetter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { interviewId } = req.params;
      console.log(req.body, req.file);
      const signedOfferLetter = req.file
        ? (req.file as Express.MulterS3.File).key
        : req.body.key;

      const response = await this.acceptOfferLetterUseCase.execute(
        interviewId,
        signedOfferLetter
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  rejectOfferLetter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { interviewId } = req.params;
      const { rejectionReason } = req.body;

      const response = await this.rejectOfferLetterUseCase.execute(
        interviewId,
        rejectionReason
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
