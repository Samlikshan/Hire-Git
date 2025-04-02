import { IJobRepository } from "../../../repositories/IJobRepository";

export class ListJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

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
  }) {
    const { jobs, total } = await this.jobRepository.listAllJobs(params);
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
