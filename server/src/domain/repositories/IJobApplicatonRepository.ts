import { Job } from "../entities/Job";
import { JobApplication } from "../entities/JobApplication";

export interface IJobApplicationRepository {
  createJobApplication(
    applicationData: JobApplication
  ): Promise<JobApplication>;
  isApplied(jobId: string, candidate: string): Promise<JobApplication | null>;
  getTrendingJobsIds(): Promise<Job[]>;
}
