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
exports.InterviewRepository = void 0;
const interviewModel_1 = require("../models/interviewModel");
const jobApplicationModel_1 = require("../models/jobApplicationModel");
class InterviewRepository {
    schedule(applicationId, job, scheduledAt, time, duration, timeZone, round, note, roomId, meetingLink) {
        return __awaiter(this, void 0, void 0, function* () {
            return interviewModel_1.InterviewModel.create({
                application: applicationId,
                job,
                scheduledAt,
                duration,
                time,
                round,
                timeZone,
                note,
                roomId,
                meetingLink,
            });
        });
    }
    ListJobInterviews(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return interviewModel_1.InterviewModel.find({ job: jobId, status: "scheduled" })
                .populate({
                path: "application",
                populate: { path: "candidate" },
            })
                .populate("job");
        });
    }
    getInterviewData(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return interviewModel_1.InterviewModel.findOne({ roomId })
                .populate({
                path: "application",
                select: "candidate",
                populate: {
                    path: "candidate",
                    select: "_id",
                },
            })
                .populate({
                path: "job",
                select: "company",
            });
        });
    }
    Evaluate(evaluation) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield interviewModel_1.InterviewModel.updateOne({ roomId: evaluation.roomID }, { $set: { evaluation: evaluation, status: "completed" } });
            const result = yield interviewModel_1.InterviewModel.findOne({
                roomId: evaluation.roomID,
            }).select("application -_id");
            const applicationId = result === null || result === void 0 ? void 0 : result.application;
            yield jobApplicationModel_1.JobApplicationModel.updateOne({ _id: applicationId }, { $set: { status: "in-progress" } });
            return response;
        });
    }
    ListJobHistory(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return interviewModel_1.InterviewModel.find()
                .populate({
                path: "application",
                populate: { path: "candidate" },
            })
                .populate({
                path: "job",
                populate: { path: "company" },
            });
        });
    }
    InProgress(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return interviewModel_1.InterviewModel.find({
                job: jobId,
                status: { $in: ["completed", "pending", "hired"] },
            }).populate({
                path: "application",
                populate: { path: "candidate" },
            });
        });
    }
    Hire(interviewId, offerLetter) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield interviewModel_1.InterviewModel.updateOne({
                _id: interviewId,
            }, {
                $set: {
                    offerStatus: "pending",
                    offerLetter: offerLetter,
                    status: "hired",
                    offerSentAt: new Date(),
                },
            });
            const result = yield interviewModel_1.InterviewModel.findOne({
                _id: interviewId,
            }).select("application -_id");
            const applicationId = result === null || result === void 0 ? void 0 : result.application;
            yield jobApplicationModel_1.JobApplicationModel.updateOne({ _id: applicationId }, { $set: { status: "hired" } });
            return response;
        });
    }
    Reject(interviewId, rejectionReason) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield interviewModel_1.InterviewModel.updateOne({
                _id: interviewId,
            }, {
                $set: {
                    rejectionReason: rejectionReason,
                    status: "rejected",
                },
            });
            const applicationId = yield interviewModel_1.InterviewModel.findOne({
                _id: interviewId,
            }).select("application");
            console.log(applicationId, "application id from the repository");
            yield jobApplicationModel_1.JobApplicationModel.updateOne({ _id: applicationId }, { $set: { status: "rejected" } });
            return response;
        });
    }
    acceptOfferLetter(interviewId, signedOfferLetter) {
        return __awaiter(this, void 0, void 0, function* () {
            return interviewModel_1.InterviewModel.updateOne({ _id: interviewId }, {
                $set: { signedOfferLetter: signedOfferLetter, offerStatus: "accepted" },
            });
        });
    }
    rejectOffer(interviewId, rejectionReason) {
        return __awaiter(this, void 0, void 0, function* () {
            return interviewModel_1.InterviewModel.updateOne({ _id: interviewId }, { $set: { offerStatus: "rejected", rejectionReason: rejectionReason } });
        });
    }
}
exports.InterviewRepository = InterviewRepository;
