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
    const query: any = {
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
}
