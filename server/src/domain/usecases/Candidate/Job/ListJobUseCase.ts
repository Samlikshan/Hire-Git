import { IJobRepository } from "../../../repositories/IJobRepository";

export class ListJobsUseCase {
  constructor(private jobRepository: IJobRepository) { }

  async execute(params: {
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
  }, userId: string) {
    let { jobs, total } = await this.jobRepository.listAllJobs(params);

    if (userId) {
      const response = await this.jobRepository.getSavedJobs(userId)
      const savedJobIds = new Set()
      response?.savedJobs.map((job) => {
        savedJobIds.add(job._id?.toString())
      })
      const updatedJobs = jobs.map((job) => {
        if (savedJobIds.has(job._id?.toString())) {
          return { ...job, isSaved: true }
        }
        return job
      })
      jobs = updatedJobs
    }

    const pages = Math.ceil(total / params.limit);

    return {
      message: "Jobs fetched successfully",
      jobs,
      total,
      page: params.page,
      pages,
    };
  }
}
