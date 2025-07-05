import { Company } from "../../entities/Company";
import { ICompanyRepository } from "../../repositories/ICompanyRepository";

export class ListCompanyUseCase {
  constructor(private companyRepository: ICompanyRepository) {}
  async execute(params: {
    page: number;
    limit: number;
    search: string;
  }): Promise<{ companies: Company[]; total: number }> {
    const { companies, total } = await this.companyRepository.listAllCompany(
      params
    );
    return { companies, total };
  }
}
