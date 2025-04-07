import { NextFunction, Request, Response } from "express";
import { ListApplicantsUseCase } from "../../../domain/usecases/company/job/ListJobApplicants";
import { JobApplicationRepository } from "../../../infrastructure/database/repositories/JobApplicationRepository";
import { HttpStatus } from "../../../domain/enums/http-status.enum";

export class JobApplicationController {
  private jobApplicationRepository = new JobApplicationRepository();

  private listApplicantsUseCase = new ListApplicantsUseCase(
    this.jobApplicationRepository
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
}
