import { Job } from "../../../entities/Job";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IJobRepository } from "../../../repositories/IJobRepository";

export class CreateJobUseCase {
  constructor(private jobRepository: IJobRepository) {}
  async execute(jobData: Job) {
    const job = await this.jobRepository.createJob(jobData);
    if (!job) {
      throw new HttpException(
        "Error creating job post. please try again.",
        HttpStatus.BAD_REQUEST
      );
    }

    return { message: "Job post created Successfully", job: job };
  }
}
