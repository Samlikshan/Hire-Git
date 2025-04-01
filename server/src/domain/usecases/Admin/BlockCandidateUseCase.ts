import { response } from "express";
import { IAdminRepository } from "../../repositories/IAdminRepository";
import { ICandidateRepository } from "../../repositories/ICandidateRepository";
import { HttpException } from "../../enums/http-exception";
import { HttpStatus } from "../../enums/http-status.enum";

export class BlockCandidateUseCase {
  constructor(
    private candidateReponsitory: ICandidateRepository,
    private adminRepository: IAdminRepository
  ) {}

  async execute(candidateId: string, status: boolean) {
    const candidate = await this.candidateReponsitory.findById(candidateId);

    if (!candidate) {
      throw new HttpException("Candidate not found.", HttpStatus.NOT_FOUND);
    }
    const response = await this.adminRepository.blockCandidate(
      candidateId,
      status
    );

    if (response.modifiedCount) {
      return { message: "Updated candidate successfully" };
    }
  }
}
