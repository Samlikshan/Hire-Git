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
exports.ValidateRoomAccessUsecase = void 0;
const http_exception_1 = require("../../enums/http-exception");
const http_status_enum_1 = require("../../enums/http-status.enum");
class ValidateRoomAccessUsecase {
    constructor(interviewRepository) {
        this.interviewRepository = interviewRepository;
    }
    execute(roomId, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const interview = yield this.interviewRepository.getInterviewData(roomId);
            if (!interview) {
                throw new http_exception_1.HttpException("Room not found", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            const populatedInterview = interview;
            if (role == "candidate") {
                const isCandidate = ((_b = (_a = populatedInterview.application) === null || _a === void 0 ? void 0 : _a.candidate) === null || _b === void 0 ? void 0 : _b._id.toString()) === userId;
                if (!isCandidate) {
                    throw new http_exception_1.HttpException("Access Denied", http_status_enum_1.HttpStatus.BAD_REQUEST);
                }
            }
            if (role == "company") {
                const isCompany = ((_d = (_c = populatedInterview.job) === null || _c === void 0 ? void 0 : _c.company) === null || _d === void 0 ? void 0 : _d.toString()) === userId;
                if (!isCompany) {
                    throw new http_exception_1.HttpException("Access Denied", http_status_enum_1.HttpStatus.BAD_REQUEST);
                }
            }
            return { message: "Entering room.", populatedInterview };
        });
    }
}
exports.ValidateRoomAccessUsecase = ValidateRoomAccessUsecase;
