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
exports.InterviewController = void 0;
const ListInterviewsUseCase_1 = require("../../../domain/usecases/company/job/ListInterviewsUseCase");
const InterviewRepository_1 = require("../../../infrastructure/database/repositories/InterviewRepository");
const EvaluateCandidateUseCase_1 = require("../../../domain/usecases/company/Interview/EvaluateCandidateUseCase");
const ListJobHistoryUseCase_1 = require("../../../domain/usecases/Candidate/Interview/ListJobHistoryUseCase");
const InProgressUseCase_1 = require("../../../domain/usecases/company/job/InProgressUseCase");
const HireCandidateUseCase_1 = require("../../../domain/usecases/company/Interview/HireCandidateUseCase");
const RejectCandidateUseCase_1 = require("../../../domain/usecases/company/Interview/RejectCandidateUseCase");
const NotificationService_1 = require("../../../infrastructure/services/NotificationService");
const AcceptOfferLetterUseCase_1 = require("../../../domain/usecases/Candidate/Job/AcceptOfferLetterUseCase");
const RejectOfferLetterUseCase_1 = require("../../../domain/usecases/Candidate/Job/RejectOfferLetterUseCase");
const ValidateRoomAccessUseCase_1 = require("../../../domain/usecases/company/ValidateRoomAccessUseCase");
class InterviewController {
    constructor() {
        this.interivewRepository = new InterviewRepository_1.InterviewRepository();
        this.notificatoinService = new NotificationService_1.NotificationService();
        //userCases
        this.listInterviesUseCase = new ListInterviewsUseCase_1.ListInterviewsUsecase(this.interivewRepository);
        this.evaluateCandidateUseCase = new EvaluateCandidateUseCase_1.EvaluateCandidateUseCase(this.interivewRepository);
        this.listJobHistoryUseCase = new ListJobHistoryUseCase_1.ListJobHistoryUseCase(this.interivewRepository);
        this.inProgressUsecase = new InProgressUseCase_1.InProgressUsecase(this.interivewRepository);
        this.hireCandidateUseCase = new HireCandidateUseCase_1.HireCandidateUseCase(this.interivewRepository, this.notificatoinService);
        this.rejectCandidateUseCase = new RejectCandidateUseCase_1.RejectCandidateUseCase(this.interivewRepository, this.notificatoinService);
        this.acceptOfferLetterUseCase = new AcceptOfferLetterUseCase_1.AcceptOfferLetter(this.interivewRepository);
        this.rejectOfferLetterUseCase = new RejectOfferLetterUseCase_1.RejectOfferLetter(this.interivewRepository);
        this.validateRoomAccessUseCase = new ValidateRoomAccessUseCase_1.ValidateRoomAccessUsecase(this.interivewRepository);
        this.listInterviews = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const response = yield this.listInterviesUseCase.execute(jobId);
                res.json({
                    interviews: response,
                    messages: "Interviews fetched successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.validateRoomAccess = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId } = req.params;
                const user = req.user;
                const response = yield this.validateRoomAccessUseCase.execute(roomId, user === null || user === void 0 ? void 0 : user.id, user === null || user === void 0 ? void 0 : user.role);
                res.json(response);
            }
            catch (error) {
                console.log(error, "error");
                next(error);
            }
        });
        this.evaluate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { completedAt, ratings, recommendation, roomID, notes } = req.body;
                const response = yield this.evaluateCandidateUseCase.execute({
                    completedAt,
                    ratings,
                    recommendation,
                    roomID,
                    notes,
                });
                res.json({ message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.listJobHistory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidateId } = req.body;
                const response = yield this.listJobHistoryUseCase.execute(candidateId);
                res.json({ message: response.message, jobHistory: response.jobHistory });
            }
            catch (error) {
                next(error);
            }
        });
        this.listInProgress = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const response = yield this.inProgressUsecase.execute(jobId);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.hire = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { interviewId } = req.params;
                const offerLetter = req.file
                    ? req.file.key
                    : req.body.key;
                const response = yield this.hireCandidateUseCase.execute(interviewId, offerLetter);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.reject = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { interviewId } = req.params;
                const { rejectionReason } = req.body;
                const response = yield this.rejectCandidateUseCase.execute(interviewId, rejectionReason);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.acceptOfferLetter = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { interviewId } = req.params;
                const signedOfferLetter = req.file
                    ? req.file.key
                    : req.body.key;
                const response = yield this.acceptOfferLetterUseCase.execute(interviewId, signedOfferLetter);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.rejectOfferLetter = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { interviewId } = req.params;
                const { rejectionReason } = req.body;
                const response = yield this.rejectOfferLetterUseCase.execute(interviewId, rejectionReason);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.InterviewController = InterviewController;
