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
exports.TrendingJobsUseCase = void 0;
class TrendingJobsUseCase {
    constructor(jobApplicationRepository, jobRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const trendingJobsids = yield this.jobApplicationRepository.getTrendingJobsIds();
            const jobIds = trendingJobsids.map((job) => job._id);
            const trendingJobs = yield this.jobRepository.getTrendingJobs(jobIds);
            return {
                message: "Fetched Trending jobs successfully.",
                trendingJobs: trendingJobs,
            };
        });
    }
}
exports.TrendingJobsUseCase = TrendingJobsUseCase;
