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
exports.SaveJobUseCase = void 0;
class SaveJobUseCase {
    constructor(jobReopository) {
        this.jobReopository = jobReopository;
    }
    execute(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSaved = yield this.jobReopository.isSavedJob(userId, jobId);
            if (!isSaved) {
                yield this.jobReopository.saveJob(userId, jobId);
            }
            else {
                yield this.jobReopository.removeJob(userId, jobId);
            }
            return { message: `Job ${isSaved ? `removed from` : `added to`} saved list` };
        });
    }
}
exports.SaveJobUseCase = SaveJobUseCase;
