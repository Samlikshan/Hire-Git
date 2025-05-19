import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IInterviewRepository } from "../../../repositories/IInterviewRepository";

export class AcceptOfferLetter {
  constructor(private interviewRepository: IInterviewRepository) {}
  async execute(interviewId: string, signedOfferLetter: string) {
    if (!interviewId || !signedOfferLetter) {
      throw new HttpException(
        "Interview id and singed offer letter is requird, Please provide required details",
        HttpStatus.BAD_REQUEST
      );
    }

    const response = await this.interviewRepository.acceptOfferLetter(
      interviewId,
      signedOfferLetter
    );
    if (response.modifiedCount) {
      return {
        message: "Accepted offer letter successfully",
      };
    }
    return {
      message: "Accepted offer letter failed, Please try again",
    };
  }
}
