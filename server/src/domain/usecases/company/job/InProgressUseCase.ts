import { IInterviewRepository } from "../../../repositories/IInterviewRepository";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";

export class InProgressUsecase {
  constructor(private interviewRepository: IInterviewRepository) {}
  async execute(jobId: string) {
    if (!jobId) {
      throw new HttpException("Job ID is missing", HttpStatus.BAD_REQUEST);
    }

    const response = await this.interviewRepository.InProgress(jobId);
    return response;
  }
}
