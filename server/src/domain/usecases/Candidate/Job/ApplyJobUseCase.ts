import { JobApplication } from "../../../entities/JobApplication";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IJobApplicationRepository } from "../../../repositories/IJobApplicatonRepository";

export class ApplyJobUseCase {
  constructor(private jobApplicationRepository: IJobApplicationRepository) {}
  async execute(applicatonData: JobApplication) {
    const isExisting = await this.jobApplicationRepository.isApplied(
      applicatonData.job as string,
      applicatonData.candidate
    );
    if (isExisting) {
      throw new HttpException(
        "Already applied for this job.",
        HttpStatus.BAD_REQUEST
      );
    }
    const application =
      await this.jobApplicationRepository.createJobApplication(applicatonData);
    if (!application) {
      throw new HttpException(
        "Error applaying job post. please try again.",
        HttpStatus.BAD_REQUEST
      );
    }
    return { message: "Job post created Successfully" };
  }
}
