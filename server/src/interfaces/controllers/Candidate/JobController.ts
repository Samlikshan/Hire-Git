import { NextFunction, Request, response, Response } from "express";
import { ListJobsUseCase } from "../../../domain/usecases/Candidate/Job/ListJobUseCase";
import { RelatedJobsUseCase } from "../../../domain/usecases/Candidate/Job/RelatedJobsUseCase";

import { JobRepository } from "../../../infrastructure/database/repositories/JobRepository";
import { HttpStatus } from "../../../domain/enums/http-status.enum";

export class JobController {
  private jobRepository = new JobRepository();
  private listJobsUseCase = new ListJobsUseCase(this.jobRepository);
  private relatedJobsUseCase = new RelatedJobsUseCase(this.jobRepository);
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

      const response = await this.listJobsUseCase.execute({
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
      });

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
}
