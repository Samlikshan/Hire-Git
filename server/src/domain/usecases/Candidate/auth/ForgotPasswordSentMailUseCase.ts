import { JwtService } from "../../../../utils/jwtService";
import { ICandidateRepository } from "../../../repositories/ICandidateRepository";
import config from "../../../../config";
import { EmailService } from "../../../../utils/emailService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";

export class ForgotPasswordSentEmailUseCase {
  constructor(
    private candidateRepository: ICandidateRepository,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}
  async execute(email: string) {
    if (!email)
      throw new HttpException(
        "Email must be provided.",
        HttpStatus.BAD_REQUEST
      );
    const user = await this.candidateRepository.findByEmail(email);
    if (!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    if (user.googleId) {
      throw new HttpException(
        `Your account doesn’t have a password. Please sign in using your Google account.`,
        HttpStatus.BAD_REQUEST
      );
    }
    const verificationToken = this.jwtService.generateVerificationToken({
      id: user.id,
    });

    const verificationLink = `${config.env.clientUrl}/candidate/reset-password/${verificationToken}`;

    await this.emailService.sendVerificationEmail(
      user.email,
      "Reset Password",
      `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    );
    return { message: "Reset email sent successfully" };
  }
}
