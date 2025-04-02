import { NextFunction, Request, Response } from "express";
import { ApplyJobUseCase } from "../../../domain/usecases/Candidate/Job/ApplyJobUseCase";
import { JobApplicationRepository } from "../../../infrastructure/database/repositories/JobApplicationRepository";
import { IsAppliedUseCase } from "../../../domain/usecases/Candidate/Job/IsAppliedUseCase";

export class JobApplicationController {
  private jobApplicatonRepository = new JobApplicationRepository();
  private applyJobUseCase = new ApplyJobUseCase(this.jobApplicatonRepository);
  private isAppliedUseCase = new IsAppliedUseCase(this.jobApplicatonRepository);
  applyJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        candidate,
        firstName,
        lastName,
        email,
        phone,
        location,
        education,
        currentTitle,
        experience,
        expectedSalary,
      } = req.body;
      let { jobId } = req.params;

      let coverLetter = "";
      let resume = "";

      if (
        req.files &&
        typeof req.files === "object" &&
        "coverLetter" in req.files
      ) {
        coverLetter =
          (req.files["coverLetter"] as Express.MulterS3.File[])[0]?.key ?? "";
      }
      if (req.files && typeof req.files === "object" && "resume" in req.files) {
        resume = (req.files["resume"] as Express.MulterS3.File[])[0]?.key ?? "";
      }
      const response = await this.applyJobUseCase.execute({
        candidate,
        job: jobId,
        firstName,
        lastName,
        phone,
        email,
        location,
        education,
        currentTitle,
        experience,
        expectedSalary,
        resume,
        coverLetter,
        status: "applied",
      });
      res.json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  isApplied = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId, candidateId } = req.params;
      const response = await this.isAppliedUseCase.execute(jobId, candidateId);
      res.json({ message: response.message, isApplied: response.isApplied });
    } catch (error) {
      next(error);
    }
  };
}
