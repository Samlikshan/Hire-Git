import { NotificationService } from "../../../../infrastructure/services/NotificationService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IInterviewRepository } from "../../../repositories/IInterviewRepository";

export class HireCandidateUseCase {
  constructor(
    private interviewRepository: IInterviewRepository,
    private notificationService: NotificationService
  ) {}
  async execute(interviewId: string, offerLetter: string) {
    if (!interviewId || !offerLetter) {
      throw new HttpException(
        "InterviewId and offerLetter are requried",
        HttpStatus.BAD_REQUEST
      );
    }

    const response = await this.interviewRepository.Hire(
      interviewId,
      offerLetter
    );
    if (response.modifiedCount) {
      return { message: "Hiring request sent to candiate successfully" };
    }
    return {
      message: "Failed to send hiring request to candidate, Please try again",
    };
  }
}
