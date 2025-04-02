import { Job } from "../../../entities/Job";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IJobRepository } from "../../../repositories/IJobRepository";

export class EditJobUseCase {
  constructor(private jobRepository: IJobRepository) {}
  async execute(updatedData: Job) {
    const response = await this.jobRepository.updateJob(updatedData);

    if (!response.modifiedCount) {
      throw new HttpException("Job updating failed.", HttpStatus.BAD_REQUEST);
    }

    return { message: "Job updated successfully." };
  }
}
