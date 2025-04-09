import { OAuth2Client } from "google-auth-library";
import { ICandidateRepository } from "../../../repositories/ICandidateRepository";
import { JwtService } from "../../../../utils/jwtService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";

export class LoginWithGoogleUseCase {
  constructor(
    private candidateRepository: ICandidateRepository,
    private client: OAuth2Client,
    private jwtService: JwtService
  ) {}

  async execute(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new HttpException(
        "Google Auth failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    let user = await this.candidateRepository.findByEmail(payload.email!);
    if (!user && payload.email && payload.name && payload.sub) {
      user = await this.candidateRepository.save({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
      });
    }
    if (!user?.googleId) {
      throw new HttpException(
        "Login with email and password",
        HttpStatus.BAD_REQUEST
      );
    }
    if (user.isBlocked)
      throw new HttpException(
        "Your account is blocked, Please Contact Admin",
        HttpStatus.FORBIDDEN
      );
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
    return {
      user,
      message: "Login Successfull",
      refreshToken: refreshToken,
      accessToken: accessToken,
    };
  }
}
