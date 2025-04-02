import { UpdateWriteOpResult } from "mongoose";
import { Job } from "../../../domain/entities/Job";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { JobModel } from "../models/jobModel";

export class JobRepository implements IJobRepository {
  async createJob(jobData: Job): Promise<Job> {
    return JobModel.create({ ...jobData });
  }
  async findJobsByCompany(companyId: string): Promise<Job[] | null> {
    return JobModel.find({ company: companyId, deleted: false }).sort({
      createdAt: -1,
    });
  }
  async findById(id: string): Promise<Job | null> {
    return JobModel.findOne({ _id: id }).populate("company");
  }
  async updateJob(updatedDetails: Job): Promise<UpdateWriteOpResult> {
    return JobModel.updateOne(
      { _id: updatedDetails._id },
      { $set: { ...updatedDetails } }
    );
  }

  async deleteJobById(jobId: string): Promise<UpdateWriteOpResult> {
    return JobModel.updateOne({ _id: jobId }, { $set: { deleted: true } });
  }
}
