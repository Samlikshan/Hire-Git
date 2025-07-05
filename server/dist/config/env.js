"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/Hire",
    jwtSecret: process.env.JWT_SECRET || "supersecretkey",
    clientUrl: process.env.CLIENT_URL || "http://localhost:4000",
};
