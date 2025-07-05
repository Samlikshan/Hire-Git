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
exports.ProfileController = void 0;
const UpdateProfileUseCase_1 = require("../../../domain/usecases/company/UpdateProfileUseCase");
const CompanyRepository_1 = require("../../../infrastructure/database/repositories/CompanyRepository");
class ProfileController {
    constructor() {
        this.companyRepository = new CompanyRepository_1.CompanyRepository();
        this.updateProfileUseCase = new UpdateProfileUseCase_1.UpdateProfileUseCase(this.companyRepository);
        this.updateProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, name = "", description = "", industry = "", companySize = "", founded = "", website = "", headquarters = "", linkedIn = "", twitter = "", about = "", } = req.body;
                let logo = req.body.logo;
                if (req.file) {
                    logo = req.file.key || req.body.logo;
                }
                const response = yield this.updateProfileUseCase.execute(_id, logo, name, description, industry, companySize, founded, website, headquarters, linkedIn, twitter, about);
                res.json({ message: response.message, logo: logo });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProfileController = ProfileController;
