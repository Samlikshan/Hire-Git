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
exports.GetSavedJobsUseCase = void 0;
class GetSavedJobsUseCase {
    constructor(jobReopository) {
        this.jobReopository = jobReopository;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.jobReopository.getSavedJobs(userId);
            const savedJobs = (_a = response === null || response === void 0 ? void 0 : response.savedJobs) === null || _a === void 0 ? void 0 : _a.map((job) => {
                return Object.assign(Object.assign({}, job), { isSaved: true });
            });
            return savedJobs;
        });
    }
}
exports.GetSavedJobsUseCase = GetSavedJobsUseCase;
