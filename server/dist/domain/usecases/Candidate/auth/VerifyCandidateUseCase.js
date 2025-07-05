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
exports.VerifyCandidateUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class VerifyCandidateUseCase {
    constructor(candidateRepository, jwtService) {
        this.candidateRepository = candidateRepository;
        this.jwtService = jwtService;
    }
    execute(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = this.jwtService.verifyToken(token);
            if (!decoded)
                throw new http_exception_1.HttpException("Invalid or expired token", http_status_enum_1.HttpStatus.BAD_REQUEST);
            const existingUser = yield this.candidateRepository.findByEmail(decoded.email);
            if (existingUser)
                throw new http_exception_1.HttpException("User already Verified", http_status_enum_1.HttpStatus.CONFLICT);
            yield this.candidateRepository.save(decoded);
            return { message: "Email verified successfully." };
        });
    }
}
exports.VerifyCandidateUseCase = VerifyCandidateUseCase;
