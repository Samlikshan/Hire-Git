import { IInterviewRepository } from "../../../repositories/IInterviewRepository";

export class EvaluateCandidateUseCase {
  constructor(private interviewRepository: IInterviewRepository) {}
  async execute(evaluation: {
    completedAt: Date;
    notes: string;
    ratings: { communication: number; cultureFit: number; technical: number };
    recommendation: string;
    roomID: string;
  }) {
    const response = await this.interviewRepository.Evaluate(evaluation);
    if (response.modifiedCount) {
      return { message: "Evaluation updated seccessfully" };
    } else {
      return { message: "Evaluation updated failed" };
    }
  }
}
