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
exports.JobApplicationController = void 0;
const ListJobApplicants_1 = require("../../../domain/usecases/company/job/ListJobApplicants");
const JobApplicationRepository_1 = require("../../../infrastructure/database/repositories/JobApplicationRepository");
const NotificationRepository_1 = require("../../../infrastructure/database/repositories/NotificationRepository");
const ShortlistCandidateUseCase_1 = require("../../../domain/usecases/company/job/ShortlistCandidateUseCase");
const NotificationService_1 = require("../../../infrastructure/services/NotificationService");
const ChatRepository_1 = require("../../../infrastructure/database/repositories/ChatRepository");
const MessageService_1 = require("../../../infrastructure/services/MessageService");
const CreateChatUseCase_1 = require("../../../domain/usecases/Chat/CreateChatUseCase");
const ScheduleInterviewUseCase_1 = require("../../../domain/usecases/company/job/ScheduleInterviewUseCase");
const InterviewRepository_1 = require("../../../infrastructure/database/repositories/InterviewRepository");
class JobApplicationController {
    constructor() {
        this.jobApplicationRepository = new JobApplicationRepository_1.JobApplicationRepository();
        this.notificatoinRepository = new NotificationRepository_1.NotificationRepository();
        this.notificationService = new NotificationService_1.NotificationService();
        this.messageService = new MessageService_1.MessageService();
        this.interviewRepository = new InterviewRepository_1.InterviewRepository();
        //useCase
        this.listApplicantsUseCase = new ListJobApplicants_1.ListApplicantsUseCase(this.jobApplicationRepository);
        this.chatRepository = new ChatRepository_1.ChatRepository();
        this.createChatUseCase = new CreateChatUseCase_1.CreateChatUseCase(this.chatRepository, this.messageService);
        this.shortlistApplicantUseCase = new ShortlistCandidateUseCase_1.ShortListCandidateUseCase(this.jobApplicationRepository, this.notificatoinRepository, this.notificationService, this.messageService, this.createChatUseCase);
        this.scheduleInterviewUseCase = new ScheduleInterviewUseCase_1.ScheduleInterviewUseCase(this.jobApplicationRepository, this.interviewRepository, this.notificatoinRepository, this.notificationService);
        this.listApplicants = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const response = yield this.listApplicantsUseCase.execute(jobId);
                res.json({ message: response.message, applicants: response.applicants });
            }
            catch (error) {
                next(error);
            }
        });
        this.shortlistApplicant = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId } = req.params;
                const response = yield this.shortlistApplicantUseCase.execute(applicationId);
                res.json({ message: response === null || response === void 0 ? void 0 : response.message });
            }
            catch (error) {
                next(error);
            }
        });
        this.scheduleInterview = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { applicationId, date, time, duration, timeZone, round, notes } = req.body;
                const response = yield this.scheduleInterviewUseCase.execute(applicationId, date, time, duration, timeZone, round, notes);
                res.json({ message: response === null || response === void 0 ? void 0 : response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.JobApplicationController = JobApplicationController;
