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
exports.ResetPasswordUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class ResetPasswordUseCase {
    constructor(companyRepository, jwtService, hashService, emailService) {
        this.companyRepository = companyRepository;
        this.jwtService = jwtService;
        this.hashService = hashService;
        this.emailService = emailService;
    }
    execute(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = this.jwtService.verifyToken(token);
            if (!decoded)
                throw new http_exception_1.HttpException("Reset link expired or Invalid link!. Please try again", http_status_enum_1.HttpStatus.BAD_REQUEST);
            const hashedPassword = yield this.hashService.hash(newPassword);
            const company = yield this.companyRepository.findById(decoded.id);
            if (!company)
                throw new http_exception_1.HttpException("Opps something happened coudn't find a company associated with this email", http_status_enum_1.HttpStatus.NOT_FOUND);
            yield this.companyRepository.findByIdAndChangePassword(decoded.id, hashedPassword);
            yield this.emailService.sendVerificationEmail(company.email, "Password Changed-Company", `<p>Your Password have been changed. If you didn't initiated it please reset your password immediately</p>`);
            return { message: "Password changed successfully" };
        });
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
