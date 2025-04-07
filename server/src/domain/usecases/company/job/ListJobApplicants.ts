import { IJobApplicationRepository } from "../../../repositories/IJobApplicatonRepository";

export class ListApplicantsUseCase {
  constructor(private jobApplicationRepository: IJobApplicationRepository) {}
  async execute(jobId: string) {
    const applicants = await this.jobApplicationRepository.listApplicants(
      jobId
    );
    return {
      message: "Fetched applicants successfully",
      applicants,
    };
  }
}
