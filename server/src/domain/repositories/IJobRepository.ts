import { UpdateWriteOpResult } from "mongoose";
import { Job } from "../entities/Job";

export interface IJobRepository {
  createJob(jobData: Job): Promise<Job>;
  findJobsByCompany(companyId: string): Promise<Job[] | null>;
  findById(id: string): Promise<Job | null>;
  updateJob(updatedDetails: Job): Promise<UpdateWriteOpResult>;
  deleteJobById(jobId: string): Promise<UpdateWriteOpResult>;
}
