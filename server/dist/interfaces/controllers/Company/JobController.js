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
const CreateJobUseCase_1 = require("../../../domain/usecases/company/job/CreateJobUseCase");
const JobRepository_1 = require("../../../infrastructure/database/repositories/JobRepository");
const ListJobsUseCase_1 = require("../../../domain/usecases/company/job/ListJobsUseCase");
const GetJobUseCase_1 = require("../../../domain/usecases/company/job/GetJobUseCase");
const EditJobUseCase_1 = require("../../../domain/usecases/company/job/EditJobUseCase");
const DeleteJobUseCase_1 = require("../../../domain/usecases/company/job/DeleteJobUseCase");
const SubscriptionGaurd_1 = require("../../../domain/services/SubscriptionGaurd");
const SubscriptionRepository_1 = require("../../../infrastructure/database/repositories/SubscriptionRepository");
class JobController {
    constructor() {
        this.jobRepository = new JobRepository_1.JobRepository();
        this.subscriptionRepository = new SubscriptionRepository_1.SubscriptionRepository();
        this.subscriptionGaurd = new SubscriptionGaurd_1.SubscriptionGuard(this.subscriptionRepository);
        this.createJobUseCase = new CreateJobUseCase_1.CreateJobUseCase(this.jobRepository, this.subscriptionGaurd);
        this.listJobUseCase = new ListJobsUseCase_1.ListJobUseCase(this.jobRepository);
        this.getJobUseCase = new GetJobUseCase_1.GetJobUseCase(this.jobRepository);
        this.editJobUseCase = new EditJobUseCase_1.EditJobUseCase(this.jobRepository);
        this.deleteJobUseCase = new DeleteJobUseCase_1.DeleteJobuseCase(this.jobRepository);
        this.createJob = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, type, deadline, company, department, description, experienceLevel, location, requiredSkills, requirements, responsibilities, salary, status, tags, } = req.body;
                const response = yield this.createJobUseCase.execute({
                    title,
                    type,
                    deadline,
                    company,
                    department,
                    description,
                    experienceLevel,
                    location,
                    requiredSkills,
                    requirements,
                    responsibilities,
                    salary,
                    status,
                    tags,
                });
                res.json({ message: response.message, job: response.job });
            }
            catch (error) {
                next(error);
            }
        });
        this.listJobs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId } = req.params;
                const { page = 1, limit = 6, status, department, location, type, experience, search, } = req.query;
                const filters = {
                    status: status,
                    department: department ? department.split(",") : [],
                    location: location ? location.split(",") : [],
                    type: type ? type.split(",") : [],
                    experience: experience ? experience.split(",") : [],
                };
                const response = yield this.listJobUseCase.execute(companyId, Number(page), Number(limit), filters, search);
                if (response) {
                    res.json({
                        message: response.message,
                        jobs: response.jobs,
                        total: response.total,
                        page: response.page,
                        limit: response.limit,
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.getJob = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const jobId = req.params.jobId;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
                const response = yield this.getJobUseCase.execute(jobId, userId, role);
                res.json({ message: response.message, job: response.job });
            }
            catch (error) {
                next(error);
            }
        });
        this.updateJob = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, title, type, deadline, company, department, description, experienceLevel, location, requiredSkills, requirements, responsibilities, salary, status, tags, } = req.body;
                const response = yield this.editJobUseCase.execute({
                    _id,
                    title,
                    type,
                    deadline,
                    company,
                    department,
                    description,
                    experienceLevel,
                    location,
                    requiredSkills,
                    requirements,
                    responsibilities,
                    salary,
                    status,
                    tags,
                });
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteJob = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const response = yield this.deleteJobUseCase.execute(jobId);
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.JobController = JobController;
