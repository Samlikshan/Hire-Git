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
exports.GetJobUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class GetJobUseCase {
    constructor(jobReopository) {
        this.jobReopository = jobReopository;
    }
    execute(jobId, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let job = yield this.jobReopository.findById(jobId);
            if (role == "candidate") {
                const response = yield this.jobReopository.getSavedJobs(userId);
                const savedJobsIds = new Set();
                (_a = response === null || response === void 0 ? void 0 : response.savedJobs) === null || _a === void 0 ? void 0 : _a.map((job) => {
                    var _a;
                    savedJobsIds.add((_a = job._id) === null || _a === void 0 ? void 0 : _a.toString());
                });
                if (savedJobsIds.has(jobId)) {
                    const updatedJob = Object.assign(Object.assign({}, job), { isSaved: true });
                    job = updatedJob;
                }
            }
            if (!job) {
                throw new http_exception_1.HttpException("Error finding job details. Please try again", http_status_enum_1.HttpStatus.NOT_FOUND);
            }
            return { message: "Job details fetched successfully", job: job };
        });
    }
}
exports.GetJobUseCase = GetJobUseCase;
