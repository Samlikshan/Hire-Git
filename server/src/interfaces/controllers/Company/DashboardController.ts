import { NextFunction, Request, response, Response } from "express";
import { DashbaordUseCase } from "../../../domain/usecases/company/Dashboard/DashboardUseCase";
import { JobApplicationRepository } from "../../../infrastructure/database/repositories/JobApplicationRepository";
import { JobRepository } from "../../../infrastructure/database/repositories/JobRepository";

export class DashboardController {
  private jobRepository = new JobRepository();
  private jobApplicationRepository = new JobApplicationRepository();
  private dashBoardUseCase = new DashbaordUseCase(
    this.jobRepository,
    this.jobApplicationRepository
  );

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user?.id;
      if (!companyId) {
        return;
      }
      const { page = 1, timeframe = "weekly", status = "all" } = req.query;

      const response = await this.dashBoardUseCase.execute({
        companyId,
        filters: {
          page: Number(page),
          limit: 5,
          timeframe: timeframe as "weekly" | "monthly",
          status: status as "all" | "active",
        },
      });

      res.json({
        message: response.message,
        data: {
          stats: response.stats,
          trends: response.trends,
          recentJobs: {
            jobs: response.recentJobs.jobs.map((job) => ({
              id: job._id,
              title: job.title,
              status: job.status,
              postedDate: job.createdAt,
            })),
            pagination: {
              currentPage: response.recentJobs.page,
              totalPages: response.recentJobs.totalPages,
            },
          },
          applicantsPerJob: response.applicantsPerJob.map((job) => ({
            jobId: job.jobId,
            title: job.title,
            applicants: job.applicants,
            status: job.status,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
