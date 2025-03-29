import { EmailService } from "../../../../utils/emailService";
import { JwtService } from "../../../../utils/jwtService";
import { HashService } from "../../../../utils/hashService";
import { ICandidateRepository } from "../../../repositories/ICandidateRepository";
import config from "../../../../config";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";

export class RegisterCandidateUseCase {
  constructor(private candidateRepository: ICandidateRepository) {}
  private emailService = new EmailService();
  private jwtService = new JwtService();
  private hashService = new HashService();
  async execute(name: string, email: string, password: string) {
    const existingUser = await this.candidateRepository.findByEmail(email);
    if (existingUser) {
      throw new HttpException("Email already registered", HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.hashService.hash(password);

    const verificationToken = this.jwtService.generateVerificationToken({
      name,
      email,
      password: hashedPassword,
    });

    const verificationLink = `${config.env.clientUrl}/verify-email/${verificationToken}`;

    await this.emailService.sendVerificationEmail(
      email,
      "Email Verification",
      `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    );

    return {
      message:
        "Registration successful. Please check your email to verify your account.",
    };
  }
}
