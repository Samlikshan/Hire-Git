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
exports.JobApplicationController = void 0;
const ApplyJobUseCase_1 = require("../../../domain/usecases/Candidate/Job/ApplyJobUseCase");
const JobApplicationRepository_1 = require("../../../infrastructure/database/repositories/JobApplicationRepository");
const IsAppliedUseCase_1 = require("../../../domain/usecases/Candidate/Job/IsAppliedUseCase");
const GetAppliedJobsUseCase_1 = require("../../../domain/usecases/Candidate/Job/GetAppliedJobsUseCase");
class JobApplicationController {
    constructor() {
        this.jobApplicatonRepository = new JobApplicationRepository_1.JobApplicationRepository();
        this.applyJobUseCase = new ApplyJobUseCase_1.ApplyJobUseCase(this.jobApplicatonRepository);
        this.isAppliedUseCase = new IsAppliedUseCase_1.IsAppliedUseCase(this.jobApplicatonRepository);
        this.getAppliedJobsUseCase = new GetAppliedJobsUseCase_1.GetAppliedJobsUseCase(this.jobApplicatonRepository);
        this.applyJob = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { candidate, firstName, lastName, email, phone, location, education, currentTitle, experience, expectedSalary, } = req.body;
                let { jobId } = req.params;
                let coverLetter = "";
                let resume = "";
                if (req.files &&
                    typeof req.files === "object" &&
                    "coverLetter" in req.files) {
                    coverLetter =
                        (_b = (_a = req.files["coverLetter"][0]) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : "";
                }
                if (req.files && typeof req.files === "object" && "resume" in req.files) {
                    resume = (_d = (_c = req.files["resume"][0]) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : "";
                }
                const response = yield this.applyJobUseCase.execute({
                    candidate,
                    job: jobId,
                    firstName,
                    lastName,
                    phone,
                    email,
                    location,
                    education,
                    currentTitle,
                    experience,
                    expectedSalary,
                    resume,
                    coverLetter,
                    status: "applied",
                });
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.isApplied = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId, candidateId } = req.params;
                const response = yield this.isAppliedUseCase.execute(jobId, candidateId);
                res.json({ message: response.message, isApplied: response.isApplied });
            }
            catch (error) {
                next(error);
            }
        });
        this.getAppliedjobs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidateId } = req.params;
                const response = yield this.getAppliedJobsUseCase.execute(candidateId);
                res.json({
                    message: response.message,
                    appliedJobs: response.appliedJobs,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.JobApplicationController = JobApplicationController;
