import { NextFunction, Request, Response } from "express";
import { ListJobsUseCase } from "../../../domain/usecases/Candidate/Job/ListJobUseCase";
import { RelatedJobsUseCase } from "../../../domain/usecases/Candidate/Job/RelatedJobsUseCase";

import { JobRepository } from "../../../infrastructure/database/repositories/JobRepository";
import { HttpStatus } from "../../../domain/enums/http-status.enum";
import { TrendingJobsUseCase } from "../../../domain/usecases/Candidate/Job/TrendingJobsUseCase";
import { JobApplicationRepository } from "../../../infrastructure/database/repositories/JobApplicationRepository";
import { SaveJobUseCase } from "../../../domain/usecases/Candidate/Job/SaveJobUseCase";
import { GetSavedJobsUseCase } from "../../../domain/usecases/Candidate/Job/GetSavedJobsUseCase";

export class JobController {
  private jobRepository = new JobRepository();
  private jobApplicationRepository = new JobApplicationRepository();
  private listJobsUseCase = new ListJobsUseCase(this.jobRepository);
  private relatedJobsUseCase = new RelatedJobsUseCase(this.jobRepository);
  private trendingJobsUseCase = new TrendingJobsUseCase(
    this.jobApplicationRepository,
    this.jobRepository
  );
  private saveJobUseCase = new SaveJobUseCase(this.jobRepository);
  private getSavedJobsUseCase = new GetSavedJobsUseCase(this.jobRepository);
  listJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 6,
        search = "",
        types = [],
        departments = [],
        locations = [],
        experience = [],
        tags = [],
      } = req.query;

      // Clean filter parameters
      const cleanArray = (arr: any) =>
        (Array.isArray(arr) ? arr : [arr]).filter(
          (item: string) => item !== "" && item !== undefined
        );
      const userId = req.user?.id;
      const response = await this.listJobsUseCase.execute(
        {
          page: Number(page),
          limit: Number(limit),
          search: search.toString(),
          filters: {
            types: cleanArray(types),
            departments: cleanArray(departments),
            locations: cleanArray(locations),
            experience: cleanArray(experience),
            tags: cleanArray(tags),
          },
        },
        userId!
      );

      res.status(HttpStatus.OK).json({
        message: response.message,
        jobs: response.jobs,
        total: response.total,
        page: response.page,
        pages: response.pages,
      });
    } catch (error) {
      next(error);
    }
  };

  getRelatedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      const response = await this.relatedJobsUseCase.execute(jobId);
      res.json({
        message: response.message,
        relatedJobs: response.relatedJobs,
      });
    } catch (error) {
      next(error);
    }
  };

  getTrendingJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.trendingJobsUseCase.execute();
      res.json({
        message: response.message,
        trendingJobs: response.trendingJobs,
      });
    } catch (error) {
      next(error);
    }
  };

  saveJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      const userId = req.user?.id;
      const response = await this.saveJobUseCase.execute(userId!, jobId);
      res.json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  getSavedJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const savedJobs = await this.getSavedJobsUseCase.execute(userId!);
      res.json({
        message: "Saved jobs fetched successfully",
        savedJobs: savedJobs,
      });
    } catch (error) {
      next(error);
    }
  };

  acceptJobOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
  };
}
