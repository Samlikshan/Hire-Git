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
exports.DashbaordUseCase = void 0;
class DashbaordUseCase {
    constructor(jobRepository, jobApplicationRepository) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyId, filters } = params;
            const [stats, recentJobs, trends, applicantsPerJob] = yield Promise.all([
                this.getStats(companyId),
                this.getRecentJobs(companyId, filters),
                this.getTrends(companyId, filters.timeframe),
                this.getApplicantsPerJob(companyId, filters.status),
            ]);
            return {
                stats,
                recentJobs,
                trends,
                applicantsPerJob,
                message: "Dashboard stats fetched successfully",
            };
        });
    }
    getStats(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [totalJobs, currentMonthJobs, activeJobs, totalApplicants] = yield Promise.all([
                this.jobRepository.countJobs(companyId),
                this.jobRepository.countMonthlyJobs(companyId),
                this.jobRepository.countActiveJobs(companyId),
                this.jobApplicationRepository.countTotalApplicants(companyId),
            ]);
            return {
                totalJobs,
                currentMonthJobs,
                activeJobs,
                totalApplicants,
            };
        });
    }
    getRecentJobs(companyId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jobRepository.listCompanyJobs({
                companyId,
                page: filters.page,
                limit: filters.limit,
                status: filters.status,
            });
        });
    }
    getTrends(companyId, timeframe) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jobRepository.getJobTrends(companyId, timeframe);
        });
    }
    getApplicantsPerJob(companyId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jobApplicationRepository.getApplicantsPerJob(companyId, status);
        });
    }
}
exports.DashbaordUseCase = DashbaordUseCase;
