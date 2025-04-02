import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IJobRepository } from "../../../repositories/IJobRepository";

export class DeleteJobuseCase {
  constructor(private jobRepository: IJobRepository) {}
  async execute(jobId: string) {
    const response = await this.jobRepository.deleteJobById(jobId);
    if (!response.modifiedCount) {
      throw new HttpException("Job deletion failed.", HttpStatus.BAD_REQUEST);
    }
    return { message: "Job Deleted successfully." };
  }
}
