import { Company } from "../../entities/Company";
import { ICompanyRepository } from "../../repositories/ICompanyRepository";

export class ListPendingCompaniesUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(): Promise<Company[]> {
    return this.companyRepository.listByStatus();
  }
}
