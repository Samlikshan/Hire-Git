import { Job } from "../../../domain/entities/Job";
import { JobApplication } from "../../../domain/entities/JobApplication";
import { IJobApplicationRepository } from "../../../domain/repositories/IJobApplicatonRepository";
import { JobApplicationModel } from "../models/jobApplicationModel";

export class JobApplicationRepository implements IJobApplicationRepository {
  async createJobApplication(
    applicationData: JobApplication
  ): Promise<JobApplication> {
    return JobApplicationModel.create({ ...applicationData });
  }

  async isApplied(
    jobId: string,
    candidate: string
  ): Promise<JobApplication | null> {
    return JobApplicationModel.findOne({ job: jobId, candidate: candidate });
  }
  getTrendingJobsIds(): Promise<Job[]> {
    return JobApplicationModel.aggregate([
      {
        $group: {
          _id: "$job",
          applicationCount: { $sum: 1 },
        },
      },

      {
        $sort: { applicationCount: -1 },
      },

      {
        $limit: 3,
      },

      {
        $project: {
          _id: "$_id",
        },
      },
    ]);
  }
}
