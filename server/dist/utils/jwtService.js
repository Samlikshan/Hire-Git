"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
class JwtService {
    constructor() { }
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.default.env.jwtSecret, { expiresIn: "7d" });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.default.env.jwtSecret, { expiresIn: "7d" });
    }
    generateVerificationToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.default.env.jwtSecret, { expiresIn: "30m" });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.default.env.jwtSecret);
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.default.env.jwtSecret);
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}
exports.JwtService = JwtService;
