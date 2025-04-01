import { Candidate } from "../../entities/Candidate";
import { ICandidateRepository } from "../../repositories/ICandidateRepository";

export class ListCandidatesUseCase {
  constructor(private candidateRepository: ICandidateRepository) {}
  async execute(): Promise<Candidate[]> {
    return this.candidateRepository.listCandidates();
  }
}
