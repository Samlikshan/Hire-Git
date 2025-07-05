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
exports.RejectOfferLetter = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class RejectOfferLetter {
    constructor(interviewRepository) {
        this.interviewRepository = interviewRepository;
    }
    execute(interviewId, rejectionReason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interviewId || !rejectionReason) {
                throw new http_exception_1.HttpException("Interview id and rejection reason is requird, Please provide required details", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            const response = yield this.interviewRepository.rejectOffer(interviewId, rejectionReason);
            if (response.modifiedCount) {
                return {
                    message: "Rejected offer letter successfully",
                };
            }
            return {
                message: "Accepted offer letter failed, Please try again",
            };
        });
    }
}
exports.RejectOfferLetter = RejectOfferLetter;
