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
const CandidateRepository_1 = require("../../../infrastructure/database/repositories/CandidateRepository");
const UpdateProfileUseCase_1 = require("../../../domain/usecases/Candidate/UpdateProfileUseCase");
const CreateExperienceUseCase_1 = require("../../../domain/usecases/Candidate/CreateExperienceUseCase");
class ProfileController {
    constructor() {
        this.candidateRepository = new CandidateRepository_1.CandidateRepository();
        this.updateProfileUseCase = new UpdateProfileUseCase_1.UpdateProfileUseCase(this.candidateRepository);
        this.createExperienceUseCase = new CreateExperienceUseCase_1.CreateExperienceUseCase(this.candidateRepository);
        this.updateProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const { id, name, profession = "", bio = "", skills = [], gitHub = "", linkedIn = "", } = req.body;
                const existingProfile = yield this.candidateRepository.findById(id);
                if (!existingProfile) {
                    res.status(404).json({ error: "Candidate profile not found" });
                    return;
                }
                let profileImage = (_a = existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.profileImage) !== null && _a !== void 0 ? _a : "";
                if (req.files &&
                    typeof req.files === "object" &&
                    "profileImage" in req.files) {
                    profileImage =
                        (_c = (_b = req.files["profileImage"][0]) === null || _b === void 0 ? void 0 : _b.key) !== null && _c !== void 0 ? _c : "";
                }
                let resume = (_d = existingProfile === null || existingProfile === void 0 ? void 0 : existingProfile.resume) !== null && _d !== void 0 ? _d : "";
                if (req.files && typeof req.files === "object" && "resume" in req.files) {
                    resume = (_f = (_e = req.files["resume"][0]) === null || _e === void 0 ? void 0 : _e.key) !== null && _f !== void 0 ? _f : "";
                }
                const response = yield this.updateProfileUseCase.execute(id, name, profession, bio, profileImage, JSON.parse(skills), resume, gitHub, linkedIn);
                res.json({
                    message: response.message,
                    image: profileImage,
                    resume: resume ? resume : null,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.addExperience = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { jobTitle, company, startDate, endDate, description, location } = req.body;
                const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const response = yield this.createExperienceUseCase.execute(candidateId, {
                    jobTitle,
                    company,
                    startDate,
                    endDate,
                    description,
                    location,
                });
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProfileController = ProfileController;
