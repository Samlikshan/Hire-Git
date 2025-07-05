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
exports.AdminRepository = void 0;
const adminModel_1 = require("../models/adminModel");
const companyModel_1 = require("../models/companyModel");
const candidateModel_1 = require("../models/candidateModel");
class AdminRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return adminModel_1.AdminModel.findOne({ email: email });
        });
    }
    AcceptCompany(companyId, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            return companyModel_1.CompanyModel.updateOne({ _id: companyId }, {
                $set: {
                    "accountStatus.status": "Accepted",
                    "accountStatus.verifiedBy": adminId,
                },
            });
        });
    }
    RejectCompany(companyId, adminId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return companyModel_1.CompanyModel.updateOne({ _id: companyId }, {
                $set: {
                    "accountStatus.status": "Rejected",
                    "accountStatus.description": description,
                    "accountStatus.verifiedBy": adminId,
                },
            });
        });
    }
    blockCandidate(candidateId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return candidateModel_1.CandidateModel.updateOne({ _id: candidateId }, { $set: { isBlocked: status } });
        });
    }
}
exports.AdminRepository = AdminRepository;
