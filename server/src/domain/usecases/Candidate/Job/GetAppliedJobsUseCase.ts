import { IJobApplicationRepository } from "../../../repositories/IJobApplicatonRepository";

export class GetAppliedJobsUseCase {
  constructor(private jobApplicationRepository: IJobApplicationRepository) {}

  async execute(candidateId: string) {
    const appliedJobs = await this.jobApplicationRepository.getAppliedJobs(
      candidateId
    );
    return {
      message: "Fetched Trending jobs successfully.",
      appliedJobs: appliedJobs,
    };
  }
}
