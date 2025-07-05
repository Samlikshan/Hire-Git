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
exports.LoginAdminUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class LoginAdminUseCase {
    constructor(adminRepository, hashService, jwtService) {
        this.adminRepository = adminRepository;
        this.hashService = hashService;
        this.jwtService = jwtService;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.adminRepository.findByEmail(email);
            if (!email || !password) {
                throw new http_exception_1.HttpException("Please provide credentilas", http_status_enum_1.HttpStatus.NOT_FOUND);
            }
            if (!user) {
                throw new http_exception_1.HttpException("Admin not found", http_status_enum_1.HttpStatus.NOT_FOUND);
            }
            const isValidPassword = yield this.hashService.compare(password, user.password);
            if (!isValidPassword) {
                throw new http_exception_1.HttpException("Invalid Credentials", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            const accessToken = this.jwtService.generateAccessToken({
                id: user.id,
                email: user.email,
                role: "admin",
            });
            const refreshToken = this.jwtService.generateRefreshToken({
                id: user.id,
                email: user.email,
                role: "admin",
            });
            return { user, message: "Login successfull", accessToken, refreshToken };
        });
    }
}
exports.LoginAdminUseCase = LoginAdminUseCase;
