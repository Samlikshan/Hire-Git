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
exports.BlockCandidateUseCase = void 0;
const http_exception_1 = require("../../enums/http-exception");
const http_status_enum_1 = require("../../enums/http-status.enum");
class BlockCandidateUseCase {
    constructor(candidateReponsitory, adminRepository) {
        this.candidateReponsitory = candidateReponsitory;
        this.adminRepository = adminRepository;
    }
    execute(candidateId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield this.candidateReponsitory.findById(candidateId);
            if (!candidate) {
                throw new http_exception_1.HttpException("Candidate not found.", http_status_enum_1.HttpStatus.NOT_FOUND);
            }
            const response = yield this.adminRepository.blockCandidate(candidateId, status);
            if (response.modifiedCount) {
                return { message: "Updated candidate successfully" };
            }
        });
    }
}
exports.BlockCandidateUseCase = BlockCandidateUseCase;
