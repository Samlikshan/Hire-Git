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
exports.EvaluateCandidateUseCase = void 0;
class EvaluateCandidateUseCase {
    constructor(interviewRepository) {
        this.interviewRepository = interviewRepository;
    }
    execute(evaluation) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.interviewRepository.Evaluate(evaluation);
            if (response.modifiedCount) {
                return { message: "Evaluation updated seccessfully" };
            }
            else {
                return { message: "Evaluation updated failed" };
            }
        });
    }
}
exports.EvaluateCandidateUseCase = EvaluateCandidateUseCase;
