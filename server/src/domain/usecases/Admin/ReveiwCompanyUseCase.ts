import { HttpException } from "../../enums/http-exception";
import { HttpStatus } from "../../enums/http-status.enum";
import { IAdminRepository } from "../../repositories/IAdminRepository";
import { ICompanyRepository } from "../../repositories/ICompanyRepository";

export class ReviewCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private adminRepository: IAdminRepository
  ) {}
  async execute(
    companyId: string,
    adminId: string,
    action: string,
    description: string
  ) {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
    }
    let response = null;
    if (action == "accept") {
      response = await this.adminRepository.AcceptCompany(companyId, adminId);
    } else if (action == "reject") {
      if (!description) {
        throw new HttpException(
          "Description is requierd when rejecting",
          HttpStatus.BAD_REQUEST
        );
      }
      response = await this.adminRepository.RejectCompany(
        companyId,
        adminId,
        description
      );
    } else {
      throw new HttpException("Invalid Action", HttpStatus.BAD_REQUEST);
    }
    if (response.modifiedCount) {
      return { message: `Company ${action}d successfully` };
    }
  }
}
