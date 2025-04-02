import { NextFunction, Request, Response } from "express";
import { Job } from "../../../domain/entities/Job";
import { CreateJobUseCase } from "../../../domain/usecases/company/job/CreateJobUseCase";

import { JobRepository } from "../../../infrastructure/database/repositories/JobRepository";

export class JobController {
  private jobRepository = new JobRepository();

  private createJobUseCase = new CreateJobUseCase(this.jobRepository);

  createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        title,
        type,
        deadline,
        company,
        department,
        description,
        experienceLevel,
        location,
        requiredSkills,
        requirements,
        responsibilities,
        salary,
        status,
        tags,
      }: Job = req.body;
      const response = await this.createJobUseCase.execute({
        title,
        type,
        deadline,
        company,
        department,
        description,
        experienceLevel,
        location,
        requiredSkills,
        requirements,
        responsibilities,
        salary,
        status,
        tags,
      });

      res.json({ message: response.message, job: response.job });
    } catch (error) {
      next(error);
    }
  };
}
