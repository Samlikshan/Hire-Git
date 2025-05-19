import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IJobRepository } from "../../../repositories/IJobRepository";
interface ListJobsFilters {
  status?: string;
  department?: string[];
  location?: string[];
  type?: string[];
  experience?: string[];
}

export class ListJobUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(
    companyId: string,
    page: number,
    limit: number,
    filters: ListJobsFilters,
    search?: string
  ) {
    const { jobs, total } = await this.jobRepository.findJobsByCompany(
      companyId,
      page,
      limit,
      filters,
      search
    );
    if (!jobs) {
      throw new HttpException(
        "Error fetchitng jobs. Please try again.",
        HttpStatus.NOT_FOUND
      );
    }
    return {
      message: "Jobs fetched successfully",
      jobs,
      total,
      page,
      limit,
    };
  }
}
