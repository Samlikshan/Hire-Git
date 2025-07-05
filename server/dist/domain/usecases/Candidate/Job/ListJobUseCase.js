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
exports.ListJobsUseCase = void 0;
class ListJobsUseCase {
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    execute(params, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let { jobs, total } = yield this.jobRepository.listAllJobs(params);
            if (userId) {
                const response = yield this.jobRepository.getSavedJobs(userId);
                const savedJobIds = new Set();
                (_a = response === null || response === void 0 ? void 0 : response.savedJobs) === null || _a === void 0 ? void 0 : _a.map((job) => {
                    var _a;
                    savedJobIds.add((_a = job._id) === null || _a === void 0 ? void 0 : _a.toString());
                });
                const updatedJobs = jobs.map((job) => {
                    var _a;
                    if (savedJobIds.has((_a = job._id) === null || _a === void 0 ? void 0 : _a.toString())) {
                        return Object.assign(Object.assign({}, job), { isSaved: true });
                    }
                    return job;
                });
                jobs = updatedJobs;
            }
            const pages = Math.ceil(total / params.limit);
            return {
                message: "Jobs fetched successfully",
                jobs,
                total,
                page: params.page,
                pages,
            };
        });
    }
}
exports.ListJobsUseCase = ListJobsUseCase;
