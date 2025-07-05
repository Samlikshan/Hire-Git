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
exports.LoginCandidateUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class LoginCandidateUseCase {
    constructor(candidateRepository, hashService, jwtService) {
        this.candidateRepository = candidateRepository;
        this.hashService = hashService;
        this.jwtService = jwtService;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.candidateRepository.findByEmail(email);
            if (!user) {
                throw new http_exception_1.HttpException("User not found", http_status_enum_1.HttpStatus.NOT_FOUND);
            }
            if (user && user.password) {
                const isValidPassword = yield this.hashService.compare(password, user.password);
                if (!isValidPassword)
                    throw new http_exception_1.HttpException("Invalid credentials", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            if (user.googleId)
                throw new http_exception_1.HttpException("Please try to login with google", http_status_enum_1.HttpStatus.BAD_REQUEST);
            if (user.isBlocked)
                throw new Error("Your account is blocked, Please Contact Admin");
            const accessToken = this.jwtService.generateAccessToken({
                id: user.id,
                email: user.email,
                role: "candidate",
            });
            const refreshToken = this.jwtService.generateRefreshToken({
                id: user.id,
                role: "candidate",
                email: user.email,
            });
            return { user, message: "Login successfull", accessToken, refreshToken };
        });
    }
}
exports.LoginCandidateUseCase = LoginCandidateUseCase;
