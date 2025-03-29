import config from "../../../../config";
import { EmailService } from "../../../../utils/emailService";
import { JwtService } from "../../../../utils/jwtService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { ICompanyRepository } from "../../../repositories/ICompanyRepository";

export class ForgotPasswordSentEmailUseCase {
  constructor(
    private companyReposiroty: ICompanyRepository,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async execute(email: string) {
    const company = await this.companyReposiroty.findByEmail(email);
    if (!company)
      throw new HttpException(
        "Company is not registered with email",
        HttpStatus.NOT_FOUND
      );
    const verificationToken = this.jwtService.generateVerificationToken({
      id: company.id,
    });
    const verificationLink = `${config.env.clientUrl}/company/reset-password/${verificationToken}`;
    await this.emailService.sendVerificationEmail(
      company.email,
      "Reset Password - Company",
      `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    );
    return { message: "Reset email sent successfully" };
  }
}
