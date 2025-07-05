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
exports.ForgotPasswordSentEmailUseCase = void 0;
const config_1 = __importDefault(require("../../../../config"));
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class ForgotPasswordSentEmailUseCase {
    constructor(candidateRepository, jwtService, emailService) {
        this.candidateRepository = candidateRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw new http_exception_1.HttpException("Email must be provided.", http_status_enum_1.HttpStatus.BAD_REQUEST);
            const user = yield this.candidateRepository.findByEmail(email);
            if (!user)
                throw new http_exception_1.HttpException("User not found", http_status_enum_1.HttpStatus.NOT_FOUND);
            if (user.googleId) {
                throw new http_exception_1.HttpException(`Your account doesn’t have a password. Please sign in using your Google account.`, http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            const verificationToken = this.jwtService.generateVerificationToken({
                id: user.id,
            });
            const verificationLink = `${config_1.default.env.clientUrl}/candidate/reset-password/${verificationToken}`;
            yield this.emailService.sendVerificationEmail(user.email, "Reset Password", `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`);
            return { message: "Reset email sent successfully" };
        });
    }
}
exports.ForgotPasswordSentEmailUseCase = ForgotPasswordSentEmailUseCase;
