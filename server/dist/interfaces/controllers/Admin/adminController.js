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
exports.AdminController = void 0;
const ListCompanyUseCase_1 = require("../../../domain/usecases/Admin/ListCompanyUseCase");
const ReveiwCompanyUseCase_1 = require("../../../domain/usecases/Admin/ReveiwCompanyUseCase");
const CompanyRepository_1 = require("../../../infrastructure/database/repositories/CompanyRepository");
const AdminRepository_1 = require("../../../infrastructure/database/repositories/AdminRepository");
const ListPendingCompaniesUseCase_1 = require("../../../domain/usecases/Admin/ListPendingCompaniesUseCase");
const ListCandidatesUseCase_1 = require("../../../domain/usecases/Admin/ListCandidatesUseCase");
const CandidateRepository_1 = require("../../../infrastructure/database/repositories/CandidateRepository");
const BlockCandidateUseCase_1 = require("../../../domain/usecases/Admin/BlockCandidateUseCase");
class AdminController {
    constructor() {
        this.adminRepository = new AdminRepository_1.AdminRepository();
        this.companyRepository = new CompanyRepository_1.CompanyRepository();
        this.candidateRepository = new CandidateRepository_1.CandidateRepository();
        this.listCompaniesUseCase = new ListCompanyUseCase_1.ListCompanyUseCase(this.companyRepository);
        this.listPendingCompaniesUseCase = new ListPendingCompaniesUseCase_1.ListPendingCompaniesUseCase(this.companyRepository);
        this.reviewCompanyUseCase = new ReveiwCompanyUseCase_1.ReviewCompanyUseCase(this.companyRepository, this.adminRepository);
        //cadidate
        this.listCandidateUseCase = new ListCandidatesUseCase_1.ListCandidatesUseCase(this.candidateRepository);
        this.blockCandidateUseCase = new BlockCandidateUseCase_1.BlockCandidateUseCase(this.candidateRepository, this.adminRepository);
        this.listPendingCompanies = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.listPendingCompaniesUseCase.execute();
                res.json({ companies: response });
            }
            catch (error) {
                next(error);
            }
        });
        this.listCompanies = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 8, search = "" } = req.query;
                const { companies, total } = yield this.listCompaniesUseCase.execute({
                    page: Number(page),
                    limit: Number(limit),
                    search: search.toString(),
                });
                res.json({
                    companies: companies,
                    totalPage: total,
                    message: "Fetched Companies Successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.reveiwCompany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyId, adminId, action, description } = req.body;
                const response = yield this.reviewCompanyUseCase.execute(companyId, adminId, action, description);
                res.json({ message: response === null || response === void 0 ? void 0 : response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.listCandidates = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 8, search = "" } = req.query;
            try {
                const response = yield this.listCandidateUseCase.execute({
                    page: Number(page),
                    limit: Number(limit),
                    search: search.toString(),
                });
                res.json({ candidates: response.candidates, totalCount: response.total });
            }
            catch (error) {
                next(error);
            }
        });
        this.blockCandidate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidateId, status } = req.body;
                const response = yield this.blockCandidateUseCase.execute(candidateId, status);
                res.json({ message: response === null || response === void 0 ? void 0 : response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AdminController = AdminController;
