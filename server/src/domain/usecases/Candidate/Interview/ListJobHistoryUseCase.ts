import mongoose from "mongoose";
import { IInterviewRepository } from "../../../repositories/IInterviewRepository";
import { JobApplication } from "../../../entities/JobApplication";

export class ListJobHistoryUseCase {
  constructor(private InterviewRepository: IInterviewRepository) {}
  async execute(candidateId: string) {
    const jobHistory = await this.InterviewRepository.ListJobHistory(candidateId);
    //temp
    // const jobHistory = response.filter(
    //   (interview) =>
    //     (interview.application as JobApplication).candidate == candidateId
    // );

    return {
      message: "Job history fetched successfully",
      jobHistory,
    };
  }
}
