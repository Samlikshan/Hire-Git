import { EmailService } from "../../../../utils/emailService";
import { HashService } from "../../../../utils/hashService";
import { JwtService } from "../../../../utils/jwtService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { ICandidateRepository } from "../../../repositories/ICandidateRepository";

export class ResetPasswordUseCase {
  constructor(
    private candidateRepository: ICandidateRepository,
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
    const user = await this.candidateRepository.findById(decoded.id);
    if (!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    if (user.googleId) {
      throw new HttpException(
        `Your account doesn’t have a password. Please sign in using your Google account.`,
        HttpStatus.BAD_REQUEST
      );
    }
    await this.candidateRepository.findByIdAndChangePassword(
      decoded.id,
      hashedPassword
    );
    await this.emailService.sendVerificationEmail(
      user.email,
      "Password Changed",
      `<p>Your Password have been changed. If you didn't initiated it please reset your password immediately</p>`
    );
    return { message: "Password changed successfully" };
  }
}
