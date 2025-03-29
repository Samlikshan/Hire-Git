import { NextFunction, Request, Response } from "express";

//services
import { HashService } from "../../utils/hashService";
import { JwtService } from "../../utils/jwtService";

//admin
import { AdminRepository } from "../../infrastructure/database/repositories/AdminRepository";
import { LoginAdminUseCase } from "../../domain/usecases/Admin/auth/LoginUseCase";

//company
import { RegisterCompanyUseCase } from "../../domain/usecases/company/auth/RegisterUseCase";
import { CompanyRepository } from "../../infrastructure/database/repositories/CompanyRepository";
import { EmailService } from "../../utils/emailService";
import { VerifyCompanyUseCase } from "../../domain/usecases/company/auth/VerifyCompanyUseCase";
import { LoginCompanyUseCase } from "../../domain/usecases/company/auth/LoginUseCase";
import { ForgotPasswordSentEmailUseCase as CompanyForgotPasswordSentEmailUseCase } from "../../domain/usecases/company/auth/ForgotPasswordSendEmailUseCase";
import { ResetPasswordUseCase as CompanyResetPasswordUseCase } from "../../domain/usecases/company/auth/ResetPassword";

const adminRepository = new AdminRepository();
const companyRepository = new CompanyRepository();

export class AuthController {
  //services
  private jwtService = new JwtService();
  private emailService = new EmailService();
  private hashService = new HashService();

  //admin
  private loginAdminUseCase = new LoginAdminUseCase(
    adminRepository,
    this.hashService,
    this.jwtService
  );

  //company
  private registerCompanyUseCase = new RegisterCompanyUseCase(
    companyRepository,
    this.hashService,
    this.jwtService,
    this.emailService
  );
  private verifyCompanyUseCase = new VerifyCompanyUseCase(
    companyRepository,
    this.jwtService
  );
  private loginCompanyUseCase = new LoginCompanyUseCase(
    companyRepository,
    this.hashService,
    this.jwtService
  );
  private companyForgotPasswordSendEmailUseCase =
    new CompanyForgotPasswordSentEmailUseCase(
      companyRepository,
      this.jwtService,
      this.emailService
    );
  private companyResetPasswordUseCase = new CompanyResetPasswordUseCase(
    companyRepository,
    this.jwtService,
    this.hashService,
    this.emailService
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

  //Company
  registerCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        companyName,
        email,
        password,
        contactNumber,
        industry,
        headquarters,
      } = req.body;
      let registrationDocument: string;

      if (!req.file) {
        throw new Error("Registration document is required");
      }

      registrationDocument = (req.file as Express.MulterS3.File).key;

      const response = await this.registerCompanyUseCase.execute(
        companyName,
        email,
        password,
        contactNumber,
        industry,
        headquarters,
        registrationDocument
      );
      res.json({ message: response.message });
    } catch (error: unknown) {
      next(error);
    }
  };

  verifyCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      const response = await this.verifyCompanyUseCase.execute(token);
      res.json({ message: response.message });
    } catch (error: unknown) {
      next(error);
    }
  };

  loginCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const response = await this.loginCompanyUseCase.execute(email, password);
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

      res.json({ user: response.company, message: response.message });
    } catch (error: unknown) {
      next(error);
    }
  };

  sendResendPasswordCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const response = await this.companyForgotPasswordSendEmailUseCase.execute(
        email
      );
      res.json({ message: response.message });
    } catch (error: unknown) {
      next(error);
    }
  };

  resetPasswordCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token, newPassword } = req.body;
      const response = await this.companyResetPasswordUseCase.execute(
        token,
        newPassword
      );
      res.json({ message: response.message });
    } catch (error: unknown) {
      next(error);
    }
  };
  logout = async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  };
}
