import { Company } from "../../entities/Company";
import { ICompanyRepository } from "../../repositories/ICompanyRepository";

export class ListCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(): Promise<Company[]> {
    return this.companyRepository.listAllCompany();
  }
}
