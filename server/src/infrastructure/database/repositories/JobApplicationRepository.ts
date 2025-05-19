import { UpdateWriteOpResult } from "mongoose";
import { Job } from "../../../domain/entities/Job";
import { JobApplication } from "../../../domain/entities/JobApplication";
import { IJobApplicationRepository } from "../../../domain/repositories/IJobApplicatonRepository";
import { JobApplicationModel } from "../models/jobApplicationModel";
import { JobModel } from "../models/jobModel";
import { ApplicantsPerJob } from "../../../domain/entities/Dashboard";

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
  async listApplicants(jobId: string): Promise<JobApplication[] | []> {
    return JobApplicationModel.find({ job: jobId }).populate("candidate");
  }
  async getApplication(applicationId: string): Promise<JobApplication | null> {
    return JobApplicationModel.findById(applicationId).populate({
      path: "job",
      populate: { path: "company" },
    });
  }
  async shortlistApplicant(
    applicationId: string
  ): Promise<UpdateWriteOpResult> {
    return JobApplicationModel.updateOne(
      { _id: applicationId },
      { $set: { status: "shortlisted" } }
    );
  }
  getAppliedJobs(candidateId: string): Promise<JobApplication[] | []> {
    return JobApplicationModel.find({ candidate: candidateId }).populate({
      path: "job",
      populate: {
        path: "company",
      },
    });
  }
  schedule(applicationId: string): Promise<UpdateWriteOpResult> {
    return JobApplicationModel.updateOne(
      { _id: applicationId },
      { $set: { status: "scheduled" } }
    );
  }
  async countTotalApplicants(companyId: string): Promise<number> {
    const jobIds = await JobModel.find({ company: companyId }).distinct("_id");
    return JobApplicationModel.countDocuments({ job: { $in: jobIds } });
  }
  
  async getApplicantsPerJob(companyId: string, status: "all" | "active") {
    const jobs = await JobModel.find({
      company: companyId,
      ...(status === "active" && { status: "active" }),
    });

    return JobModel.aggregate([
      {
        $match: {
          _id: { $in: jobs.map((j) => j._id) },
        },
      },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "job",
          as: "applications",
        },
      },
      {
        $project: {
          jobId: "$_id",
          title: 1,
          status: 1,
          applicants: { $size: "$applications" },
        },
      },
      {
        $sort: { applicants: -1 },
      },
    ]);
  }
}
