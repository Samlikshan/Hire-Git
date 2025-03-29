import { ICandidateRepository } from "../../../repositories/ICandidateRepository";
import { JwtService } from "../../../../utils/jwtService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";

export class VerifyCandidateUseCase {
  constructor(
    private candidateRepository: ICandidateRepository,
    private jwtService: JwtService
  ) {}

  async execute(token: string) {
    const decoded = this.jwtService.verifyToken(token);
    if (!decoded)
      throw new HttpException(
        "Invalid or expired token",
        HttpStatus.BAD_REQUEST
      );

    const existingUser = await this.candidateRepository.findByEmail(
      decoded.email
    );
    if (existingUser)
      throw new HttpException("User already Verified", HttpStatus.CONFLICT);

    await this.candidateRepository.save(decoded);
    return { message: "Email verified successfully." };
  }
}
