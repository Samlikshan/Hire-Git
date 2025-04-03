import { IJobApplicationRepository } from "../../../repositories/IJobApplicatonRepository";
import { IJobRepository } from "../../../repositories/IJobRepository";

export class TrendingJobsUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepository,
    private jobRepository: IJobRepository
  ) {}
  async execute() {
    const trendingJobsids =
      await this.jobApplicationRepository.getTrendingJobsIds();
    const jobIds = trendingJobsids.map((job) => job._id!);
    const trendingJobs = await this.jobRepository.getTrendingJobs(jobIds);
    return {
      message: "Fetched Trending jobs successfully.",
      trendingJobs: trendingJobs,
    };
  }
  
}
