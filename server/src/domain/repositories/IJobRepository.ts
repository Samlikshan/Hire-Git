import mongoose, { UpdateWriteOpResult } from "mongoose";
import { Job } from "../entities/Job";
import { Candidate } from "../entities/Candidate";
import { TrendData } from "../entities/Dashboard";

export interface IJobRepository {
  createJob(jobData: Job): Promise<Job>;
  findJobsByCompany(
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
  ): Promise<{ jobs: Job[]; total: number }>;
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
  getTrendingJobs(jobIds: string[]): Promise<Job[]>;
  isSavedJob(userId: string, jobId: string): Promise<Candidate[] | null>;
  saveJob(userId: string, jobId: string): Promise<UpdateWriteOpResult>;
  removeJob(userId: string, jobId: string): Promise<UpdateWriteOpResult>;
  getSavedJobs(userId: string): Promise<Candidate | null>;
  countJobs(companyId: string): Promise<number>;
  countMonthlyJobs(companyId: string): Promise<number>;
  countActiveJobs(companyId: string): Promise<number>;
  listCompanyJobs(params: {
    companyId: string;
    page: number;
    limit: number;
    status: "all" | "active";
  }): Promise<{ jobs: Job[]; total: number; page: number; totalPages: number }>;
  getJobTrends(
    companyId: string,
    timeframe: "weekly" | "monthly"
  ): Promise<TrendData[]>;
}
