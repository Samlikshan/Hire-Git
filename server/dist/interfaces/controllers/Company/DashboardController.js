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
exports.DashboardController = void 0;
const DashboardUseCase_1 = require("../../../domain/usecases/company/Dashboard/DashboardUseCase");
const JobApplicationRepository_1 = require("../../../infrastructure/database/repositories/JobApplicationRepository");
const JobRepository_1 = require("../../../infrastructure/database/repositories/JobRepository");
class DashboardController {
    constructor() {
        this.jobRepository = new JobRepository_1.JobRepository();
        this.jobApplicationRepository = new JobApplicationRepository_1.JobApplicationRepository();
        this.dashBoardUseCase = new DashboardUseCase_1.DashbaordUseCase(this.jobRepository, this.jobApplicationRepository);
        this.getStats = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!companyId) {
                    return;
                }
                const { page = 1, timeframe = "weekly", status = "all" } = req.query;
                const response = yield this.dashBoardUseCase.execute({
                    companyId,
                    filters: {
                        page: Number(page),
                        limit: 5,
                        timeframe: timeframe,
                        status: status,
                    },
                });
                res.json({
                    message: response.message,
                    data: {
                        stats: response.stats,
                        trends: response.trends,
                        recentJobs: {
                            jobs: response.recentJobs.jobs.map((job) => ({
                                id: job._id,
                                title: job.title,
                                status: job.status,
                                postedDate: job.createdAt,
                            })),
                            pagination: {
                                currentPage: response.recentJobs.page,
                                totalPages: response.recentJobs.totalPages,
                            },
                        },
                        applicantsPerJob: response.applicantsPerJob.map((job) => ({
                            jobId: job.jobId,
                            title: job.title,
                            applicants: job.applicants,
                            status: job.status,
                        })),
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.DashboardController = DashboardController;
