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
exports.ShortListCandidateUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class ShortListCandidateUseCase {
    constructor(jobApplicationRepository, notificationRepository, notificationService, messageService, createChatUseCase) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
        this.messageService = messageService;
        this.createChatUseCase = createChatUseCase;
    }
    execute(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield this.jobApplicationRepository.getApplication(applicationId);
            if (!application) {
                throw new http_exception_1.HttpException("Application not found", http_status_enum_1.HttpStatus.NOT_FOUND);
            }
            const response = yield this.jobApplicationRepository.shortlistApplicant(applicationId);
            if (!response.modifiedCount) {
                throw new http_exception_1.HttpException("Shortlisting candidate falied", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            const notification = {
                type: "job",
                title: "Application Shortlisted",
                message: `Congratulations! Your application for the ${application.job.title} at ${(application === null || application === void 0 ? void 0 : application.job).company.name} has been shortlisted. Our team was impressed with your qualifications.`,
                read: false,
                job: application.job._id,
                candidate: application.candidate,
                action: {
                    type: "view",
                    label: "View Application",
                    url: "/applications/meta",
                },
            };
            const newNotification = yield this.notificationRepository.createNotificaton(notification);
            if (newNotification) {
                yield this.notificationService.sendNotification(application.candidate, newNotification);
            }
            yield this.createChatUseCase.execute((application === null || application === void 0 ? void 0 : application.job).company.id, application.candidate.toString(), application.job._id.toString());
            return { message: "Shortlisted candidate successfully" };
        });
    }
}
exports.ShortListCandidateUseCase = ShortListCandidateUseCase;
