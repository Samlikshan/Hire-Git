import { HttpException } from "../../enums/http-exception";
import { HttpStatus } from "../../enums/http-status.enum";
import { IInterviewRepository } from "../../repositories/IInterviewRepository";

export class ValidateRoomAccessUsecase {
  constructor(private interviewRepository: IInterviewRepository) {}
  async execute(
    roomId: string,
    userId: string,
    role: "company" | "candidate" | "admin" | undefined
  ) {
    const interview: unknown = await this.interviewRepository.getInterviewData(
      roomId
    );
    if (!interview) {
      throw new HttpException("Room not found", HttpStatus.BAD_REQUEST);
    }
    const populatedInterview = interview as {
      application: {
        candidate: {
          _id: string;
        };
      };
      job: {
        company: string;
      };
    };

    if (role == "candidate") {
      const isCandidate =
        populatedInterview.application?.candidate?._id.toString() === userId;
      if (!isCandidate) {
        throw new HttpException("Access Denied", HttpStatus.BAD_REQUEST);
      }
    }
    if (role == "company") {
      const isCompany = populatedInterview.job?.company?.toString() === userId;
      if (!isCompany) {
        throw new HttpException("Access Denied", HttpStatus.BAD_REQUEST);
      }
    }

    return { message: "Entering room.", populatedInterview };
  }
}
