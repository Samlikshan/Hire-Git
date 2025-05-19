import { UpdateWriteOpResult } from "mongoose";
import { Job } from "../../../domain/entities/Job";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { JobModel } from "../models/jobModel";
import { CandidateModel } from "../models/candidateModel";
import { Candidate } from "../../../domain/entities/Candidate";
import mongoose from "mongoose";
import { startOfMonth, endOfMonth } from "date-fns";
import { TrendData } from "../../../domain/entities/Dashboard";
import { FilterQuery } from "mongoose";

export class JobRepository implements IJobRepository {
  async createJob(jobData: Job): Promise<Job> {
    return JobModel.create({ ...jobData });
  }
  async findJobsByCompany(
    companyId: string,
    page: number,
    limit: number,
    filters: {
      status?: string;
      department?: string[];
      location?: string[];
      type?: string[];
      experience?: string[];
    },
    search?: string
  ): Promise<{ jobs: Job[]; total: number }> {
    const query: any = {
      company: companyId,
      deleted: false,
    };

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.department?.length) {
      query.department = { $in: filters.department };
    }
    if (filters.location?.length) {
      query.location = { $in: filters.location };
    }
    if (filters.type?.length) {
      query.type = { $in: filters.type };
    }
    if (filters.experience?.length) {
      query.experienceLevel = { $in: filters.experience };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const total = await JobModel.countDocuments(query);
    const jobs = await JobModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { jobs, total };
  }
  async findById(id: string): Promise<Job | null> {
    return JobModel.findOne({ _id: id }).populate("company").lean();
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

  async listAllJobs(params: {
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
  }): Promise<{ jobs: Job[]; total: number }> {
    const query: FilterQuery<Job> = {
      status: "active",
      deleted: false,
    };

    // Search filter
    if (params.search) {
      query.$or = [
        { title: { $regex: params.search, $options: "i" } },
        { description: { $regex: params.search, $options: "i" } },
        { tags: { $regex: params.search, $options: "i" } },
      ];
    }

    // Add other filters
    const filterMapping = {
      type: params.filters.types,
      department: params.filters.departments,
      location: params.filters.locations,
      experienceLevel: params.filters.experience,
    };

    Object.entries(filterMapping).forEach(([key, values]) => {
      if (values && values.length > 0) {
        query[key] = { $in: values };
      }
    });

    // Handle tags filter
    if (params.filters.tags.length > 0) {
      query.tags = { $all: params.filters.tags };
    }

    const skip = (params.page - 1) * params.limit;

    const [jobs, total] = await Promise.all([
      JobModel.find(query)
        .populate("company")
        .skip(skip)
        .limit(params.limit)
        .lean()
        .exec(),
      JobModel.countDocuments(query),
    ]);

    return { jobs, total };
  }
  async findTagsById(
    id: string
  ): Promise<Partial<Job> | { tags: string[]; _id: string } | null> {
    return JobModel.findOne({ _id: id }).select("tags");
  }

  async findRelatedJobsByTags(
    tags: string[],
    currentJobId: string
  ): Promise<Job[] | []> {
    return JobModel.find({ _id: { $ne: currentJobId }, tags: { $in: tags } });
  }
  async getTrendingJobs(jobIds: string[]): Promise<Job[]> {
    return JobModel.find({ _id: { $in: jobIds } }).populate(
      "company",
      "_id name logo"
    );
  }
  async isSavedJob(userId: string, jobId: string): Promise<Candidate[] | null> {
    return CandidateModel.findOne({ _id: userId, savedJobs: { $in: [jobId] } });
  }
  async saveJob(userId: string, jobId: string): Promise<UpdateWriteOpResult> {
    return CandidateModel.updateOne(
      { _id: userId },
      { $addToSet: { savedJobs: jobId } }
    );
  }
  async removeJob(userId: string, jobId: string): Promise<UpdateWriteOpResult> {
    return CandidateModel.updateOne(
      { _id: userId },
      { $pull: { savedJobs: jobId } }
    );
  }
  async getSavedJobs(userId: string): Promise<Candidate | null> {
    return CandidateModel.findOne({ _id: userId })
      .populate({ path: "savedJobs", populate: "company" })
      .select("savedJobs")
      .lean();
  }
  async countActiveJobs(companyId: string): Promise<number> {
    return JobModel.countDocuments({
      company: companyId,
      status: "active",
      deleted: false,
    });
  }

  async countJobs(companyId: string): Promise<number> {
    return JobModel.countDocuments({
      company: companyId,
      deleted: false,
    });
  }
  async countMonthlyJobs(companyId: string): Promise<number> {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return JobModel.countDocuments({
      company: companyId,
      createdAt: { $gte: start, $lte: end },
    });
  }
  async listCompanyJobs(params: {
    companyId: string;
    page: number;
    limit: number;
    status: "all" | "active";
  }): Promise<{
    jobs: Job[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { companyId, page = 1, limit = 5, status } = params;
    const skip = (page - 1) * limit;

    const query: FilterQuery<Job> = {
      company: companyId,
      deleted: false,
    };

    if (status === "active") {
      query.status = "active";
    }

    const [jobs, total] = await Promise.all([
      JobModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      JobModel.countDocuments(query),
    ]);

    return {
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  // infrastructure/repositories/JobRepository.ts
  async getJobTrends(companyId: string, timeframe: "weekly" | "monthly") {
    const groupFormat = timeframe === "weekly" ? "%Y-%U" : "%Y-%m";

    return JobModel.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
          createdAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          label: "$_id",
          value: "$count",
          _id: 0,
        },
      },
    ]);
  }
}
