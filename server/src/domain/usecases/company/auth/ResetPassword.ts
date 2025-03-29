import { EmailService } from "../../../../utils/emailService";
import { HashService } from "../../../../utils/hashService";
import { JwtService } from "../../../../utils/jwtService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { ICompanyRepository } from "../../../repositories/ICompanyRepository";

export class ResetPasswordUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private jwtService: JwtService,
    private hashService: HashService,
    private emailService: EmailService
  ) {}
  async execute(token: string, newPassword: string) {
    const decoded = this.jwtService.verifyToken(token);
    if (!decoded)
      throw new HttpException(
        "Reset link expired or Invalid link!. Please try again",
        HttpStatus.BAD_REQUEST
      );
    const hashedPassword = await this.hashService.hash(newPassword);
    const company = await this.companyRepository.findById(decoded.id);
    if (!company)
      throw new HttpException(
        "Opps something happened coudn't find a company associated with this email",
        HttpStatus.NOT_FOUND
      );
    await this.companyRepository.findByIdAndChangePassword(
      decoded.id,
      hashedPassword
    );

    await this.emailService.sendVerificationEmail(
      company.email,
      "Password Changed-Company",
      `<p>Your Password have been changed. If you didn't initiated it please reset your password immediately</p>`
    );
    return { message: "Password changed successfully" };
  }
}
