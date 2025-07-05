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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCompanyUseCase = void 0;
const config_1 = __importDefault(require("../../../../config"));
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class RegisterCompanyUseCase {
    constructor(companyRepository, hashService, jwtService, emailService) {
        this.companyRepository = companyRepository;
        this.hashService = hashService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    execute(name, email, password, contactNumber, industry, headquarters, registrationDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCompany = yield this.companyRepository.findByEmailOrName(name, email);
            if (existingCompany && existingCompany.email == email) {
                throw new http_exception_1.HttpException("Account already exist with this email", http_status_enum_1.HttpStatus.CONFLICT);
            }
            if (existingCompany && existingCompany.name == name) {
                throw new http_exception_1.HttpException("Account already exist with this Name", http_status_enum_1.HttpStatus.CONFLICT);
            }
            const hashedPassword = yield this.hashService.hash(password);
            const verificationToken = yield this.jwtService.generateVerificationToken({
                name,
                email,
                password: hashedPassword,
                contactNumber,
                industry,
                headquarters,
                registrationDocument,
            });
            const verificationLink = `${config_1.default.env.clientUrl}/verify-company/${verificationToken}`;
            yield this.emailService.sendVerificationEmail(email, "Account Verification-Company", `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`);
            return {
                message: "Registration successful. Please check your email to verify your account.",
            };
        });
    }
}
exports.RegisterCompanyUseCase = RegisterCompanyUseCase;
