import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IInterviewRepository } from "../../../repositories/IInterviewRepository";

export class RejectOfferLetter {
  constructor(private interviewRepository: IInterviewRepository) {}
  async execute(interviewId: string, rejectionReason: string) {
    if (!interviewId || !rejectionReason) {
      throw new HttpException(
        "Interview id and rejection reason is requird, Please provide required details",
        HttpStatus.BAD_REQUEST
      );
    }

    const response = await this.interviewRepository.rejectOffer(
      interviewId,
      rejectionReason
    );
    if (response.modifiedCount) {
      return {
        message: "Rejected offer letter successfully",
      };
    }
    return {
      message: "Accepted offer letter failed, Please try again",
    };
  }
}
