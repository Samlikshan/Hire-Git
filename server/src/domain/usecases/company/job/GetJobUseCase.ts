import { Job } from "../../../entities/Job";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IJobRepository } from "../../../repositories/IJobRepository";

export class GetJobUseCase {
  constructor(private jobReopository: IJobRepository) {}
  async execute(jobId: string) {
    const job = await this.jobReopository.findById(jobId);
    if (!job) {
      throw new HttpException(
        "Error finding job details. Please try again",
        HttpStatus.NOT_FOUND
      );
    }

    return { message: "Job details fetched successfully", job: job };
  }
}
