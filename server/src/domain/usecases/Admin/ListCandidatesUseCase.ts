import { Candidate } from "../../entities/Candidate";
import { ICandidateRepository } from "../../repositories/ICandidateRepository";

export class ListCandidatesUseCase {
  constructor(private candidateRepository: ICandidateRepository) {}
  async execute(params: {
    page: number;
    limit: number;
    search: string;
  }): Promise<{ candidates: Candidate[]; total: number }> {
    return this.candidateRepository.listCandidates(params);
  }
}
