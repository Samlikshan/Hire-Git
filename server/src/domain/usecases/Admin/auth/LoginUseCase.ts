import { HashService } from "../../../../utils/hashService";
import { JwtService } from "../../../../utils/jwtService";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { IAdminRepository } from "../../../repositories/IAdminRepository";

export class LoginAdminUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private hashService: HashService,
    private jwtService: JwtService
  ) {}

  async execute(email: string, password: string) {
    const user = await this.adminRepository.findByEmail(email);

    if (!email || !password) {
      throw new HttpException(
        "Please provide credentilas",
        HttpStatus.NOT_FOUND
      );
    }
    if (!user) {
      throw new HttpException("Admin not found", HttpStatus.NOT_FOUND);
    }
    const isValidPassword = await this.hashService.compare(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new HttpException("Invalid Credentials", HttpStatus.BAD_REQUEST);
    }
    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: "admin",
    });
    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: "admin",
    });

    return { user, message: "Login successfull", accessToken, refreshToken };
  }
}
