"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("./env"));
const app_1 = __importDefault(require("./app"));
const thirdParty_1 = __importDefault(require("./thirdParty"));
exports.default = {
    env: env_1.default,
    app: app_1.default,
    thirdParty: thirdParty_1.default,
};
