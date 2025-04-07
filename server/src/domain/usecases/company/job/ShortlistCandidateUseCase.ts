import { Company } from "../../../entities/Company";
import { Job } from "../../../entities/Job";
import { IJobApplicationRepository } from "../../../repositories/IJobApplicatonRepository";

import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";

export class ShortListCandidateUseCase {
  constructor(private jobApplicationRepository: IJobApplicationRepository) {}

  async execute(applicationId: string) {
    const application = await this.jobApplicationRepository.getApplication(
      applicationId
    );

    if (!application) {
      throw new HttpException("Application not found", HttpStatus.NOT_FOUND);
    }

    const response = await this.jobApplicationRepository.shortlistApplicant(
      applicationId
    );

    if (!response.modifiedCount) {
      throw new HttpException(
        "Shortlisting candidate falied",
        HttpStatus.BAD_REQUEST
      );
    }

    return { message: "Shortlisted candidate successfully" };
  }
}
