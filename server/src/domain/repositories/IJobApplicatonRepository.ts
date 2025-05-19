import { UpdateWriteOpResult } from "mongoose";
import { Job } from "../entities/Job";
import { JobApplication } from "../entities/JobApplication";
import { ApplicantsPerJob } from "../entities/Dashboard";

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
  schedule(applicationId: string): Promise<UpdateWriteOpResult>;
  countTotalApplicants(companyId: string): Promise<number>;
  getApplicantsPerJob(
    companyId: string,
    status: "all" | "active"
  ): Promise<ApplicantsPerJob[]>;
}
