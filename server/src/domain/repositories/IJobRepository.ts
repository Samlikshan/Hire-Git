import { UpdateWriteOpResult } from "mongoose";
import { Job } from "../entities/Job";

export interface IJobRepository {
  createJob(jobData: Job): Promise<Job>;
  findJobsByCompany(companyId: string): Promise<Job[] | null>;
  findById(id: string): Promise<Job | null>;
  updateJob(updatedDetails: Job): Promise<UpdateWriteOpResult>;
  deleteJobById(jobId: string): Promise<UpdateWriteOpResult>;
  listAllJobs(params: {
    page: number;
    limit: number;
    search: string;
    filters: {
      types: string[];
      departments: string[];
      locations: string[];
      experience: string[];
      tags: string[];
    };
  }): Promise<{ jobs: Job[]; total: number }>;
  findTagsById(
    id: string
  ): Promise<Partial<Job> | { tags: string[]; _id: string } | null>;
  findRelatedJobsByTags(
    tags: string[],
    currentJobId: string
  ): Promise<Job[] | []>;
}
