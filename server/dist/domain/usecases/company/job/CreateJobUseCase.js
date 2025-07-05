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
exports.CreateJobUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class CreateJobUseCase {
    constructor(jobRepository, subscriptionGuard) {
        this.jobRepository = jobRepository;
        this.subscriptionGuard = subscriptionGuard;
    }
    execute(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            const haveSubscription = yield this.subscriptionGuard.haveSubscripton(jobData.company.toString());
            if (!haveSubscription) {
                throw new http_exception_1.HttpException("You don't have any active plan, Please try to purchase a subscription", http_status_enum_1.HttpStatus.FORBIDDEN);
            }
            const canPost = yield this.subscriptionGuard.checkLimit(jobData.company.toString(), "jobpost");
            if (!canPost) {
                throw new http_exception_1.HttpException("Job post limit reached for this plan", http_status_enum_1.HttpStatus.FORBIDDEN);
            }
            const job = yield this.jobRepository.createJob(jobData);
            if (!job) {
                throw new http_exception_1.HttpException("Error creating job post. please try again.", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            yield this.subscriptionGuard.incrementUsage(jobData.company.toString(), "jobpost");
            return { message: "Job post created Successfully", job: job };
        });
    }
}
exports.CreateJobUseCase = CreateJobUseCase;
