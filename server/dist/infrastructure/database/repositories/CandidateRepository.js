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
exports.CandidateRepository = void 0;
const candidateModel_1 = require("../models/candidateModel");
class CandidateRepository {
    save(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateModel_1.CandidateModel.create(Object.assign(Object.assign({}, candidate), { isVerified: true }));
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateModel_1.CandidateModel.findOne({ email: email });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateModel_1.CandidateModel.findOne({ _id: id });
        });
    }
    findByIdAndChangePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateModel_1.CandidateModel.updateOne({ _id: id }, { $set: { password: password } });
        });
    }
    listCandidates(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (params.page - 1) * params.limit;
            const total = yield candidateModel_1.CandidateModel.countDocuments({
                name: { $regex: params.search, $options: "i" },
            });
            const candidates = yield candidateModel_1.CandidateModel.find({
                name: { $regex: params.search, $options: "i" },
            })
                .skip(skip)
                .limit(params.limit)
                .select("name email profession isBlocked");
            return { candidates, total };
        });
    }
    findAndUpdateProfile(id, name, profession, bio, profileImage, skills, resume, gitHub, linkedIn) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateModel_1.CandidateModel.updateOne({
                _id: id,
            }, {
                $set: {
                    name: name,
                    bio: bio,
                    profession: profession,
                    skills: skills,
                    resume: resume,
                    profileImage: profileImage,
                    "socialLinks.linkedIn": linkedIn,
                    "socialLinks.gitHub": gitHub,
                },
            });
        });
    }
    findAndCreateExperience(candidateId, jobTitle, company, startDate, endDate, description, location) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield candidateModel_1.CandidateModel.updateOne({ _id: candidateId }, {
                $push: {
                    experience: [
                        { jobTitle, company, startDate, endDate, description, location },
                    ],
                },
            });
        });
    }
}
exports.CandidateRepository = CandidateRepository;
