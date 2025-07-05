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
exports.JobController = void 0;
const ListJobUseCase_1 = require("../../../domain/usecases/Candidate/Job/ListJobUseCase");
const RelatedJobsUseCase_1 = require("../../../domain/usecases/Candidate/Job/RelatedJobsUseCase");
const JobRepository_1 = require("../../../infrastructure/database/repositories/JobRepository");
const http_status_enum_1 = require("../../../domain/enums/http-status.enum");
const TrendingJobsUseCase_1 = require("../../../domain/usecases/Candidate/Job/TrendingJobsUseCase");
const JobApplicationRepository_1 = require("../../../infrastructure/database/repositories/JobApplicationRepository");
const SaveJobUseCase_1 = require("../../../domain/usecases/Candidate/Job/SaveJobUseCase");
const GetSavedJobsUseCase_1 = require("../../../domain/usecases/Candidate/Job/GetSavedJobsUseCase");
class JobController {
    constructor() {
        this.jobRepository = new JobRepository_1.JobRepository();
        this.jobApplicationRepository = new JobApplicationRepository_1.JobApplicationRepository();
        this.listJobsUseCase = new ListJobUseCase_1.ListJobsUseCase(this.jobRepository);
        this.relatedJobsUseCase = new RelatedJobsUseCase_1.RelatedJobsUseCase(this.jobRepository);
        this.trendingJobsUseCase = new TrendingJobsUseCase_1.TrendingJobsUseCase(this.jobApplicationRepository, this.jobRepository);
        this.saveJobUseCase = new SaveJobUseCase_1.SaveJobUseCase(this.jobRepository);
        this.getSavedJobsUseCase = new GetSavedJobsUseCase_1.GetSavedJobsUseCase(this.jobRepository);
        this.listJobs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { page = 1, limit = 6, search = "", types = [], departments = [], locations = [], experience = [], tags = [], } = req.query;
                // Clean filter parameters
                const cleanArray = (arr) => (Array.isArray(arr) ? arr : [arr]).filter((item) => item !== "" && item !== undefined);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const response = yield this.listJobsUseCase.execute({
                    page: Number(page),
                    limit: Number(limit),
                    search: search.toString(),
                    filters: {
                        types: cleanArray(types),
                        departments: cleanArray(departments),
                        locations: cleanArray(locations),
                        experience: cleanArray(experience),
                        tags: cleanArray(tags),
                    },
                }, userId);
                res.status(http_status_enum_1.HttpStatus.OK).json({
                    message: response.message,
                    jobs: response.jobs,
                    total: response.total,
                    page: response.page,
                    pages: response.pages,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getRelatedJobs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const response = yield this.relatedJobsUseCase.execute(jobId);
                res.json({
                    message: response.message,
                    relatedJobs: response.relatedJobs,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getTrendingJobs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.trendingJobsUseCase.execute();
                res.json({
                    message: response.message,
                    trendingJobs: response.trendingJobs,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.saveJob = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { jobId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const response = yield this.saveJobUseCase.execute(userId, jobId);
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.getSavedJobs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const savedJobs = yield this.getSavedJobsUseCase.execute(userId);
                res.json({
                    message: "Saved jobs fetched successfully",
                    savedJobs: savedJobs,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.acceptJobOffer = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.JobController = JobController;
