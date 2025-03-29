import { HashService } from "../../../../utils/hashService";
import { JwtService } from "../../../../utils/jwtService";
import { EmailService } from "../../../../utils/emailService";
import { ICompanyRepository } from "../../../repositories/ICompanyRepository";
import config from "../../../../config";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";

export class RegisterCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private hashService: HashService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async execute(
    name: string,
    email: string,
    password: string,
    contactNumber: number,
    industry: string,
    headquarters: string,
    registrationDocument: string
  ) {
    const existingCompany = await this.companyRepository.findByEmailOrName(
      name,
      email
    );
    if (existingCompany && existingCompany.email == email) {
      throw new HttpException(
        "Account already exist with this email",
        HttpStatus.CONFLICT
      );
    }
    if (existingCompany && existingCompany.name == name) {
      throw new HttpException(
        "Account already exist with this Name",
        HttpStatus.CONFLICT
      );
    }

    const hashedPassword = await this.hashService.hash(password);

    const verificationToken = await this.jwtService.generateVerificationToken({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      industry,
      headquarters,
      registrationDocument,
    });

    const verificationLink = `${config.env.clientUrl}/verify-company/${verificationToken}`;

    await this.emailService.sendVerificationEmail(
      email,
      "Account Verification-Company",
      `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    );

    return {
      message:
        "Registration successful. Please check your email to verify your account.",
    };
  }
}
