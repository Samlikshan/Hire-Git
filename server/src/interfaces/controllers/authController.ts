import { NextFunction, Request, Response } from "express";

//services
import { HashService } from "../../utils/hashService";
import { JwtService } from "../../utils/jwtService";

//admin

import { HttpStatus } from "../../domain/enums/http-status.enum";
import { HttpException } from "../../domain/enums/http-exception";
import { AdminRepository } from "../../infrastructure/database/repositories/AdminRepository";
import { LoginAdminUseCase } from "../../domain/usecases/Admin/auth/LoginUseCase";
const adminRepository = new AdminRepository();

export class AuthController {
  //services
  private jwtService = new JwtService();
  private hashService = new HashService();

  //admin
  private loginAdminUseCase = new LoginAdminUseCase(
    adminRepository,
    this.hashService,
    this.jwtService
  );

  //admin
  loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const response = await this.loginAdminUseCase.execute(email, password);

      res.cookie("accessToken", response.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 60 * 1000,
      });

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ user: response.user, message: response.message });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  };
}
