import { Job } from "../entities/Job";

export interface IJobRepository {
  createJob(jobData: Job): Promise<Job>;
}
