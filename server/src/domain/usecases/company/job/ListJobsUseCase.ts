import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IJobRepository } from "../../../repositories/IJobRepository";

export class ListJobUseCase {
  constructor(private jobRepository: IJobRepository) {}
  async execute(companyId: string) {
    const jobs = await this.jobRepository.findJobsByCompany(companyId);
    if (!jobs) {
      throw new HttpException(
        "Error fetchitng jobs. Please try again.",
        HttpStatus.NOT_FOUND
      );
    }
    return { message: "Jobs fetched successfully", jobs: jobs };
  }
}
