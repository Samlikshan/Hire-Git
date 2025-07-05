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
exports.LoginWithGoogleUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class LoginWithGoogleUseCase {
    constructor(candidateRepository, client, jwtService) {
        this.candidateRepository = candidateRepository;
        this.client = client;
        this.jwtService = jwtService;
    }
    execute(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new http_exception_1.HttpException("Google Auth failed", http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            let user = yield this.candidateRepository.findByEmail(payload.email);
            if (!user && payload.email && payload.name && payload.sub) {
                user = yield this.candidateRepository.save({
                    name: payload.name,
                    email: payload.email,
                    googleId: payload.sub,
                });
            }
            if (!(user === null || user === void 0 ? void 0 : user.googleId)) {
                throw new http_exception_1.HttpException("Login with email and password", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            if (user.isBlocked)
                throw new http_exception_1.HttpException("Your account is blocked, Please Contact Admin", http_status_enum_1.HttpStatus.FORBIDDEN);
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
            return {
                user,
                message: "Login Successfull",
                refreshToken: refreshToken,
                accessToken: accessToken,
            };
        });
    }
}
exports.LoginWithGoogleUseCase = LoginWithGoogleUseCase;
