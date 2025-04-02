import { Job } from "../../../domain/entities/Job";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { JobModel } from "../models/jobModel";

export class JobRepository implements IJobRepository {
  async createJob(jobData: Job): Promise<Job> {
    return JobModel.create({ ...jobData });
  }
}
