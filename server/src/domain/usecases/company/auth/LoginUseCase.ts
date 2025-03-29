import { HashService } from "../../../../utils/hashService";
import { JwtService } from "../../../../utils/jwtService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { ICompanyRepository } from "../../../repositories/ICompanyRepository";

export class LoginCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private hashService: HashService,
    private jwtService: JwtService
  ) {}

  async execute(email: string, password: string) {
    const company = await this.companyRepository.findByEmail(email);
    if (!company) {
      throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
    }
    const isValidPassword = await this.hashService.compare(
      password,
      company?.password
    );
    if (!isValidPassword) {
      throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
    }

    const accessToken = this.jwtService.generateAccessToken({
      id: company.id,
      role: "company",
      email: company.email,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      id: company.id,
      email: company.email,
    });
    return { company, message: "Login successfull", accessToken, refreshToken };
  }
}
