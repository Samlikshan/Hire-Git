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
exports.VerifyCompanyUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class VerifyCompanyUseCase {
    constructor(companyRepository, jwtService) {
        this.companyRepository = companyRepository;
        this.jwtService = jwtService;
    }
    execute(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = this.jwtService.verifyToken(token);
            if (decoded == null)
                throw new http_exception_1.HttpException("Invalid or expired link", http_status_enum_1.HttpStatus.BAD_REQUEST);
            const existingCompany = yield this.companyRepository.findByEmailOrName(decoded.name, decoded.email);
            if (existingCompany && existingCompany.email == decoded.email) {
                throw new http_exception_1.HttpException("Account already exist with this email", http_status_enum_1.HttpStatus.CONFLICT);
            }
            if (existingCompany && existingCompany.name == decoded.name) {
                throw new http_exception_1.HttpException("Account already exist with this Name", http_status_enum_1.HttpStatus.CONFLICT);
            }
            if (!decoded.contactNumber ||
                !decoded.industry ||
                !decoded.headquarters ||
                !decoded.registrationDocument) {
                throw new http_exception_1.HttpException("Something went wrong please try to register agian", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            yield this.companyRepository.save({
                name: decoded.name,
                email: decoded.email,
                password: decoded.password,
                contactNumber: decoded.contactNumber,
                industry: decoded.industry,
                headquarters: decoded.headquarters,
                registrationDocument: decoded.registrationDocument,
            });
            return { message: "Email verified successfully" };
        });
    }
}
exports.VerifyCompanyUseCase = VerifyCompanyUseCase;
