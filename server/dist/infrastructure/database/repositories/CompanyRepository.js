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
exports.CompanyRepository = void 0;
const companyModel_1 = require("../models/companyModel");
class CompanyRepository {
    save(company) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield companyModel_1.CompanyModel.create(Object.assign(Object.assign({}, company), { isEmailVerified: true }));
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield companyModel_1.CompanyModel.findOne({ email: email });
        });
    }
    findByEmailOrName(name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield companyModel_1.CompanyModel.findOne({
                $or: [{ email: email }, { name: name }],
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield companyModel_1.CompanyModel.findById(id);
        });
    }
    findByIdAndChangePassword(id, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield companyModel_1.CompanyModel.updateOne({ _id: id }, { $set: { password: newPassword } });
        });
    }
    listByStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield companyModel_1.CompanyModel.find({ "accountStatus.status": "Pending" });
        });
    }
    listAllCompany(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (params.page - 1) * params.limit;
            const total = yield companyModel_1.CompanyModel.countDocuments({
                name: { $regex: params.search, $options: "i" },
            });
            const companies = yield companyModel_1.CompanyModel.find({
                name: { $regex: params.search, $options: "i" },
            })
                .skip(skip)
                .limit(params.limit)
                .select("name email contactNumber industry registrationDocument accountStatus");
            return { companies, total };
        });
    }
    findByIdAndUpdateProfile(id, logo, name, description, industry, companySize, founded, website, headquarters, linkedIn, twitter, about) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield companyModel_1.CompanyModel.updateOne({ _id: id }, {
                $set: {
                    logo: logo,
                    name: name,
                    description: description,
                    industry: industry,
                    companySize: companySize,
                    founded: founded,
                    website: website,
                    headquarters: headquarters,
                    "socialLinks.linkedIn": linkedIn,
                    "socialLinks.twitter": twitter,
                    about: about,
                },
            });
        });
    }
}
exports.CompanyRepository = CompanyRepository;
