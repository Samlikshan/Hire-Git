import { NextFunction, Request, Response } from "express";
import { Job } from "../../../domain/entities/Job";
import { CreateJobUseCase } from "../../../domain/usecases/company/job/CreateJobUseCase";

import { JobRepository } from "../../../infrastructure/database/repositories/JobRepository";
import { ListJobUseCase } from "../../../domain/usecases/company/job/ListJobsUseCase";
import { GetJobUseCase } from "../../../domain/usecases/company/job/GetJobUseCase";
import { EditJobUseCase } from "../../../domain/usecases/company/job/EditJobUseCase";
import { DeleteJobuseCase } from "../../../domain/usecases/company/job/DeleteJobUseCase";
import { SubscriptionGuard } from "../../../domain/services/SubscriptionGaurd";
import { SubscriptionRepository } from "../../../infrastructure/database/repositories/SubscriptionRepository";

export class JobController {
  private jobRepository = new JobRepository();
  private subscriptionRepository = new SubscriptionRepository();
  private subscriptionGaurd = new SubscriptionGuard(
    this.subscriptionRepository
  );
  private createJobUseCase = new CreateJobUseCase(
    this.jobRepository,
    this.subscriptionGaurd
  );
  private listJobUseCase = new ListJobUseCase(this.jobRepository);
  private getJobUseCase = new GetJobUseCase(this.jobRepository);
  private editJobUseCase = new EditJobUseCase(this.jobRepository);
  private deleteJobUseCase = new DeleteJobuseCase(this.jobRepository);

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

  listJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId } = req.params;
      const {
        page = 1,
        limit = 6,
        status,
        department,
        location,
        type,
        experience,
        search,
      } = req.query;

      const filters = {
        status: status as string | undefined,
        department: department ? (department as string).split(",") : [],
        location: location ? (location as string).split(",") : [],
        type: type ? (type as string).split(",") : [],
        experience: experience ? (experience as string).split(",") : [],
      };

      const response = await this.listJobUseCase.execute(
        companyId,
        Number(page),
        Number(limit),
        filters,
        search as string | undefined
      );
      if (response) {
        res.json({
          message: response.message,
          jobs: response.jobs,
          total: response.total,
          page: response.page,
          limit: response.limit,
        });
      }
    } catch (error) {
      next(error);
    }
  };
  getJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobId;
      const userId = req.user?.id;
      const role = req.user?.role;
      const response = await this.getJobUseCase.execute(jobId, userId!, role!);

      res.json({ message: response.message, job: response.job });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        _id,
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
      } = req.body;

      const response = await this.editJobUseCase.execute({
        _id,
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

      res.json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      const response = await this.deleteJobUseCase.execute(jobId);
      res.json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };
}
