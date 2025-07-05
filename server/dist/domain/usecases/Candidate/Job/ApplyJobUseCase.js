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
exports.ApplyJobUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class ApplyJobUseCase {
    constructor(jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }
    execute(applicatonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExisting = yield this.jobApplicationRepository.isApplied(applicatonData.job, applicatonData.candidate);
            if (isExisting) {
                throw new http_exception_1.HttpException("Already applied for this job.", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            const application = yield this.jobApplicationRepository.createJobApplication(applicatonData);
            if (!application) {
                throw new http_exception_1.HttpException("Error applaying job post. please try again.", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            return { message: "Job post created Successfully" };
        });
    }
}
exports.ApplyJobUseCase = ApplyJobUseCase;
