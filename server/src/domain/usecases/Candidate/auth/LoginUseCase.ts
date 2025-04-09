import { HashService } from "../../../../utils/hashService";
import { JwtService } from "../../../../utils/jwtService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { ICandidateRepository } from "../../../repositories/ICandidateRepository";

export class LoginCandidateUseCase {
  constructor(
    private candidateRepository: ICandidateRepository,
    private hashService: HashService,
    private jwtService: JwtService
  ) {}
  async execute(email: string, password: string) {
    const user = await this.candidateRepository.findByEmail(email);

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    if (user && user.password) {
      const isValidPassword = await this.hashService.compare(
        password,
        user.password
      );

      if (!isValidPassword)
        throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
    }
    if (user.googleId)
      throw new HttpException(
        "Please try to login with google",
        HttpStatus.BAD_REQUEST
      );
    if (user.isBlocked)
      throw new Error("Your account is blocked, Please Contact Admin");
    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: "candidate",
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      role: "candidate",
      email: user.email,
    });

    return { user, message: "Login successfull", accessToken, refreshToken };
  }
}
