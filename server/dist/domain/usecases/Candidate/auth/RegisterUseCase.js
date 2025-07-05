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
exports.RegisterCandidateUseCase = void 0;
const emailService_1 = require("../../../../utils/emailService");
const jwtService_1 = require("../../../../utils/jwtService");
const hashService_1 = require("../../../../utils/hashService");
const config_1 = __importDefault(require("../../../../config"));
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class RegisterCandidateUseCase {
    constructor(candidateRepository) {
        this.candidateRepository = candidateRepository;
        this.emailService = new emailService_1.EmailService();
        this.jwtService = new jwtService_1.JwtService();
        this.hashService = new hashService_1.HashService();
    }
    execute(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.candidateRepository.findByEmail(email);
            if (existingUser) {
                throw new http_exception_1.HttpException("Email already registered", http_status_enum_1.HttpStatus.CONFLICT);
            }
            const hashedPassword = yield this.hashService.hash(password);
            const verificationToken = this.jwtService.generateVerificationToken({
                name,
                email,
                password: hashedPassword,
            });
            const verificationLink = `${config_1.default.env.clientUrl}/verify-email/${verificationToken}`;
            yield this.emailService.sendVerificationEmail(email, "Email Verification", `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`);
            return {
                message: "Registration successful. Please check your email to verify your account.",
            };
        });
    }
}
exports.RegisterCandidateUseCase = RegisterCandidateUseCase;
