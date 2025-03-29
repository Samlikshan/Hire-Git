import { JwtService } from "../../../../utils/jwtService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { ICompanyRepository } from "../../../repositories/ICompanyRepository";

export class VerifyCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private jwtService: JwtService
  ) {}
  async execute(token: string) {
    const decoded = this.jwtService.verifyToken(token);

    if (decoded == null)
      throw new HttpException(
        "Invalid or expired link",
        HttpStatus.BAD_REQUEST
      );
    const existingCompany = await this.companyRepository.findByEmailOrName(
      decoded.name,
      decoded.email
    );
    if (existingCompany && existingCompany.email == decoded.email) {
      throw new HttpException(
        "Account already exist with this email",
        HttpStatus.CONFLICT
      );
    }
    if (existingCompany && existingCompany.name == decoded.name) {
      throw new HttpException(
        "Account already exist with this Name",
        HttpStatus.CONFLICT
      );
    }
    if (
      !decoded.contactNumber ||
      !decoded.industry ||
      !decoded.headquarters ||
      !decoded.registrationDocument
    ) {
      throw new HttpException(
        "Something went wrong please try to register agian",
        HttpStatus.BAD_REQUEST
      );
    }
    await this.companyRepository.save({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
      contactNumber: decoded.contactNumber,
      industry: decoded.industry,
      headquarters: decoded.headquarters,
      registrationDocument: decoded.registrationDocument,
    });

    return { message: "Email verified successfully" };
  }
}
