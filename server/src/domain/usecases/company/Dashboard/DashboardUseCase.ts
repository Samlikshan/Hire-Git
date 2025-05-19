import { IJobApplicationRepository } from "../../../repositories/IJobApplicatonRepository";
import { IJobRepository } from "../../../repositories/IJobRepository";

export class DashbaordUseCase {
  constructor(
    private jobRepository: IJobRepository,
    private jobApplicationRepository: IJobApplicationRepository
  ) {}
  async execute(params: {
    companyId: string;
    filters: {
      page: number;
      limit: number;
      timeframe: "weekly" | "monthly";
      status: "all" | "active";
    };
  }) {
    const { companyId, filters } = params;

    const [stats, recentJobs, trends, applicantsPerJob] = await Promise.all([
      this.getStats(companyId),
      this.getRecentJobs(companyId, filters),
      this.getTrends(companyId, filters.timeframe),
      this.getApplicantsPerJob(companyId, filters.status),
    ]);
    return {
      stats,
      recentJobs,
      trends,
      applicantsPerJob,
      message: "Dashboard stats fetched successfully",
    };
  }
  private async getStats(companyId: string) {
    const [totalJobs, currentMonthJobs, activeJobs, totalApplicants] =
      await Promise.all([
        this.jobRepository.countJobs(companyId),
        this.jobRepository.countMonthlyJobs(companyId),
        this.jobRepository.countActiveJobs(companyId),
        this.jobApplicationRepository.countTotalApplicants(companyId),
      ]);

    return {
      totalJobs,
      currentMonthJobs,
      activeJobs,
      totalApplicants,
    };
  }
  private async getRecentJobs(
    companyId: string,
    filters: { page: number; limit: number; status: "all" | "active" }
  ) {
    return this.jobRepository.listCompanyJobs({
      companyId,
      page: filters.page,
      limit: filters.limit,
      status: filters.status,
    });
  }

  private async getTrends(companyId: string, timeframe: "weekly" | "monthly") {
    return this.jobRepository.getJobTrends(companyId, timeframe);
  }

  private async getApplicantsPerJob(
    companyId: string,
    status: "all" | "active"
  ) {
    return this.jobApplicationRepository.getApplicantsPerJob(companyId, status);
  }
}
