"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
//services
const google_auth_library_1 = require("google-auth-library");
const emailService_1 = require("../../utils/emailService");
const hashService_1 = require("../../utils/hashService");
const jwtService_1 = require("../../utils/jwtService");
//admin
const AdminRepository_1 = require("../../infrastructure/database/repositories/AdminRepository");
const LoginUseCase_1 = require("../../domain/usecases/Admin/auth/LoginUseCase");
//company
const RegisterUseCase_1 = require("../../domain/usecases/company/auth/RegisterUseCase");
const CompanyRepository_1 = require("../../infrastructure/database/repositories/CompanyRepository");
const VerifyCompanyUseCase_1 = require("../../domain/usecases/company/auth/VerifyCompanyUseCase");
const LoginUseCase_2 = require("../../domain/usecases/company/auth/LoginUseCase");
const ForgotPasswordSendEmailUseCase_1 = require("../../domain/usecases/company/auth/ForgotPasswordSendEmailUseCase");
const ResetPassword_1 = require("../../domain/usecases/company/auth/ResetPassword");
//candidate
const CandidateRepository_1 = require("../../infrastructure/database/repositories/CandidateRepository");
const RegisterUseCase_2 = require("../../domain/usecases/Candidate/auth/RegisterUseCase");
const VerifyCandidateUseCase_1 = require("../../domain/usecases/Candidate/auth/VerifyCandidateUseCase");
const LoginUseCase_3 = require("../../domain/usecases/Candidate/auth/LoginUseCase");
const LoginWithGoogleUseCase_1 = require("../../domain/usecases/Candidate/auth/LoginWithGoogleUseCase");
const ForgotPasswordSentMailUseCase_1 = require("../../domain/usecases/Candidate/auth/ForgotPasswordSentMailUseCase");
const ResetPasswordUseCase_1 = require("../../domain/usecases/Candidate/auth/ResetPasswordUseCase");
const http_exception_1 = require("../../domain/enums/http-exception");
const http_status_enum_1 = require("../../domain/enums/http-status.enum");
const candidateRepository = new CandidateRepository_1.CandidateRepository();
const companyRepository = new CompanyRepository_1.CompanyRepository();
const adminRepository = new AdminRepository_1.AdminRepository();
class AuthController {
    constructor() {
        //services
        this.jwtService = new jwtService_1.JwtService();
        this.emailService = new emailService_1.EmailService();
        this.hashService = new hashService_1.HashService();
        //admin
        this.loginAdminUseCase = new LoginUseCase_1.LoginAdminUseCase(adminRepository, this.hashService, this.jwtService);
        //company
        this.registerCompanyUseCase = new RegisterUseCase_1.RegisterCompanyUseCase(companyRepository, this.hashService, this.jwtService, this.emailService);
        this.verifyCompanyUseCase = new VerifyCompanyUseCase_1.VerifyCompanyUseCase(companyRepository, this.jwtService);
        this.loginCompanyUseCase = new LoginUseCase_2.LoginCompanyUseCase(companyRepository, this.hashService, this.jwtService);
        this.companyForgotPasswordSendEmailUseCase = new ForgotPasswordSendEmailUseCase_1.ForgotPasswordSentEmailUseCase(companyRepository, this.jwtService, this.emailService);
        this.companyResetPasswordUseCase = new ResetPassword_1.ResetPasswordUseCase(companyRepository, this.jwtService, this.hashService, this.emailService);
        //candidate
        this.registerCandidateUseCase = new RegisterUseCase_2.RegisterCandidateUseCase(candidateRepository);
        this.verifyCandidateUseCase = new VerifyCandidateUseCase_1.VerifyCandidateUseCase(candidateRepository, this.jwtService);
        this.loginCandidateUseCase = new LoginUseCase_3.LoginCandidateUseCase(candidateRepository, this.hashService, this.jwtService);
        this.loginWithEmailUseCase = new LoginWithGoogleUseCase_1.LoginWithGoogleUseCase(candidateRepository, new google_auth_library_1.OAuth2Client(), this.jwtService);
        this.candidateFrogotPasswordSentEmailUseCase = new ForgotPasswordSentMailUseCase_1.ForgotPasswordSentEmailUseCase(candidateRepository, this.jwtService, this.emailService);
        this.candidateResetPasswordUseCase = new ResetPasswordUseCase_1.ResetPasswordUseCase(candidateRepository, this.jwtService, this.hashService, this.emailService);
        //admin
        this.loginAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const response = yield this.loginAdminUseCase.execute(email, password);
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
            }
            catch (error) {
                next(error);
            }
        });
        //Company
        this.registerCompany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyName, email, password, contactNumber, industry, headquarters, } = req.body;
                let registrationDocument;
                if (!req.file) {
                    throw new Error("Registration document is required");
                }
                registrationDocument = req.file.key;
                const response = yield this.registerCompanyUseCase.execute(companyName, email, password, contactNumber, industry, headquarters, registrationDocument);
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyCompany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const response = yield this.verifyCompanyUseCase.execute(token);
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.loginCompany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const response = yield this.loginCompanyUseCase.execute(email, password);
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
            }
            catch (error) {
                next(error);
            }
        });
        this.sendResendPasswordCompany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const response = yield this.companyForgotPasswordSendEmailUseCase.execute(email);
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.resetPasswordCompany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                const response = yield this.companyResetPasswordUseCase.execute(token, newPassword);
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.registerCandidate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const response = yield this.registerCandidateUseCase.execute(name, email, password);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyCandidate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const response = yield this.verifyCandidateUseCase.execute(token);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.loginCandidate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const response = yield this.loginCandidateUseCase.execute(email, password);
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
            }
            catch (error) {
                next(error);
            }
        });
        this.loginWithGoogle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const response = yield this.loginWithEmailUseCase.execute(token);
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
            }
            catch (error) {
                next(error);
            }
        });
        this.sendResetPasswordLinkCandidate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const response = yield this.candidateFrogotPasswordSentEmailUseCase.execute(email);
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.resetPasswordCandidate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                const response = yield this.candidateResetPasswordUseCase.execute(token, newPassword);
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    throw new http_exception_1.HttpException("Refresh token is required", http_status_enum_1.HttpStatus.BAD_REQUEST);
                }
                let decoded = this.jwtService.verifyRefreshToken(refreshToken);
                if (!decoded) {
                    throw new http_exception_1.HttpException("Invalid Refresh token", http_status_enum_1.HttpStatus.BAD_REQUEST);
                }
                const accessToken = this.jwtService.generateAccessToken({
                    id: decoded === null || decoded === void 0 ? void 0 : decoded.id,
                    email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
                    role: decoded === null || decoded === void 0 ? void 0 : decoded.role,
                });
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 15 * 60 * 60 * 1000,
                });
                res.json({ message: "Token refreshed succssfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.json({ message: "Logged out successfully" });
        });
    }
}
exports.AuthController = AuthController;
