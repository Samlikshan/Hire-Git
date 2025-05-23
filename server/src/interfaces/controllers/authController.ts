import { NextFunction, Request, Response } from "express";

//services
import { OAuth2Client } from "google-auth-library";
import { EmailService } from "../../utils/emailService";
import { HashService } from "../../utils/hashService";
import { JwtService } from "../../utils/jwtService";

//admin
import { AdminRepository } from "../../infrastructure/database/repositories/AdminRepository";
import { LoginAdminUseCase } from "../../domain/usecases/Admin/auth/LoginUseCase";

//company
import { RegisterCompanyUseCase } from "../../domain/usecases/company/auth/RegisterUseCase";
import { CompanyRepository } from "../../infrastructure/database/repositories/CompanyRepository";
import { VerifyCompanyUseCase } from "../../domain/usecases/company/auth/VerifyCompanyUseCase";
import { LoginCompanyUseCase } from "../../domain/usecases/company/auth/LoginUseCase";
import { ForgotPasswordSentEmailUseCase as CompanyForgotPasswordSentEmailUseCase } from "../../domain/usecases/company/auth/ForgotPasswordSendEmailUseCase";
import { ResetPasswordUseCase as CompanyResetPasswordUseCase } from "../../domain/usecases/company/auth/ResetPassword";

//candidate
import { CandidateRepository } from "../../infrastructure/database/repositories/CandidateRepository";
import { RegisterCandidateUseCase } from "../../domain/usecases/Candidate/auth/RegisterUseCase";
import { VerifyCandidateUseCase } from "../../domain/usecases/Candidate/auth/VerifyCandidateUseCase";
import { LoginCandidateUseCase } from "../../domain/usecases/Candidate/auth/LoginUseCase";
import { LoginWithGoogleUseCase } from "../../domain/usecases/Candidate/auth/LoginWithGoogleUseCase";
import { ForgotPasswordSentEmailUseCase as CandidateFrogotPasswordSentEmailUseCase } from "../../domain/usecases/Candidate/auth/ForgotPasswordSentMailUseCase";
import { ResetPasswordUseCase as CandidateResetPasswordUseCase } from "../../domain/usecases/Candidate/auth/ResetPasswordUseCase";
import { HttpException } from "../../domain/enums/http-exception";
import { HttpStatus } from "../../domain/enums/http-status.enum";

const candidateRepository = new CandidateRepository();
const companyRepository = new CompanyRepository();
const adminRepository = new AdminRepository();

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

  //candidate
  private registerCandidateUseCase = new RegisterCandidateUseCase(
    candidateRepository
  );
  private verifyCandidateUseCase = new VerifyCandidateUseCase(
    candidateRepository,
    this.jwtService
  );
  private loginCandidateUseCase = new LoginCandidateUseCase(
    candidateRepository,
    this.hashService,
    this.jwtService
  );
  private loginWithEmailUseCase = new LoginWithGoogleUseCase(
    candidateRepository,
    new OAuth2Client(),
    this.jwtService
  );
  private candidateFrogotPasswordSentEmailUseCase =
    new CandidateFrogotPasswordSentEmailUseCase(
      candidateRepository,
      this.jwtService,
      this.emailService
    );

  private candidateResetPasswordUseCase = new CandidateResetPasswordUseCase(
    candidateRepository,
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

  registerCandidate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, email, password } = req.body;
      const response = await this.registerCandidateUseCase.execute(
        name,
        email,
        password
      );
      res.json(response);
    } catch (error: unknown) {
      next(error);
    }
  };

  verifyCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const response = await this.verifyCandidateUseCase.execute(token);
      res.json(response);
    } catch (error: unknown) {
      next(error);
    }
  };

  loginCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const response = await this.loginCandidateUseCase.execute(
        email,
        password
      );

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
    } catch (error: unknown) {
      next(error);
    }
  };

  loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const response = await this.loginWithEmailUseCase.execute(token);
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
    } catch (error: unknown) {
      next(error);
    }
  };

  sendResetPasswordLinkCandidate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const response =
        await this.candidateFrogotPasswordSentEmailUseCase.execute(email);
      res.json({ message: response.message });
    } catch (error: unknown) {
      next(error);
    }
  };

  resetPasswordCandidate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token, newPassword } = req.body;
      const response = await this.candidateResetPasswordUseCase.execute(
        token,
        newPassword
      );
      res.json({ message: response.message });
    } catch (error: unknown) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new HttpException(
          "Refresh token is required",
          HttpStatus.BAD_REQUEST
        );
      }
      let decoded = this.jwtService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        throw new HttpException(
          "Invalid Refresh token",
          HttpStatus.BAD_REQUEST
        );
      }
      const accessToken = this.jwtService.generateAccessToken({
        id: decoded?.id,
        email: decoded?.email,
        role: decoded?.role,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 60 * 1000,
      });
      res.json({ message: "Token refreshed succssfully" });
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
