import { application } from "express";
import { IJobApplicationRepository } from "../../../repositories/IJobApplicatonRepository";

export class IsAppliedUseCase {
  constructor(private jobApplicationRepository: IJobApplicationRepository) {}
  async execute(jobId: string, candidate: string) {
    const application = await this.jobApplicationRepository.isApplied(
      jobId,
      candidate
    );
    if (application) {
      return { message: "Candidate already applied.", isApplied: true };
    }
    return {
      message: "Candidate has not applied.",
      isApplied: false,
    };
  }
}
