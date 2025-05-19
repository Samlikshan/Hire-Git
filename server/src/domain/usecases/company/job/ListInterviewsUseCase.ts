import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IInterviewRepository } from "../../../repositories/IInterviewRepository";

export class ListInterviewsUsecase {
  constructor(private interviewRepository: IInterviewRepository) {}
  async execute(jobId: string) {
    if (!jobId) {
      throw new HttpException("Job ID is missing", HttpStatus.BAD_REQUEST);
    }

    const interviews = await this.interviewRepository.ListJobInterviews(jobId);
    return interviews;
  }
}
