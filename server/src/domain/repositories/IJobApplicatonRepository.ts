import { UpdateWriteOpResult } from "mongoose";
import { Job } from "../entities/Job";
import { JobApplication } from "../entities/JobApplication";

export interface IJobApplicationRepository {
  createJobApplication(
    applicationData: JobApplication
  ): Promise<JobApplication>;
  isApplied(jobId: string, candidate: string): Promise<JobApplication | null>;
  getTrendingJobsIds(): Promise<Job[]>;
  listApplicants(jobId: string): Promise<JobApplication[] | []>;
  getApplication(applicationId: string): Promise<JobApplication | null>;
  shortlistApplicant(applicationId: string): Promise<UpdateWriteOpResult>;
  getAppliedJobs(candidateId: string): Promise<JobApplication[] | []>;
}
