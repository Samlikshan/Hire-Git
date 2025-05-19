import { NotificationService } from "../../../../infrastructure/services/NotificationService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IInterviewRepository } from "../../../repositories/IInterviewRepository";

export class RejectCandidateUseCase {
  constructor(
    private interviewRepository: IInterviewRepository,
    private notificationService: NotificationService
  ) {}
  async execute(interviewId: string, rejectionReason: string) {
    if (!interviewId || rejectionReason) {
      throw new HttpException(
        "InterviewId and offerLetter are requried",
        HttpStatus.BAD_REQUEST
      );
    }

    const response = await this.interviewRepository.Reject(
      interviewId,
      rejectionReason
    );
    if (response.modifiedCount) {
      return { message: "Rejected canidate successfully" };
    }
    return { message: "Failed to reject candiate, Please try again" };
  }
}
