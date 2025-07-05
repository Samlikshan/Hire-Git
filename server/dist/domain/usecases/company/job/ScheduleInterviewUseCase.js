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
exports.ScheduleInterviewUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
const uuid_1 = require("uuid");
class ScheduleInterviewUseCase {
    constructor(jobApplicationRepository, interviewRepository, notificationRepository, notificationService) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.interviewRepository = interviewRepository;
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
    }
    execute(applicationId, scheduledAt, time, duration, timeZone, round, note) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield this.jobApplicationRepository.getApplication(applicationId);
            if (!application) {
                throw new http_exception_1.HttpException("Application not found", http_status_enum_1.HttpStatus.NOT_FOUND);
            }
            const roomId = (0, uuid_1.v4)();
            const meetingLink = `/interview/${roomId}`;
            const schedule = yield this.interviewRepository.schedule(applicationId, application.job, scheduledAt, time, duration, timeZone, round, note, roomId, meetingLink);
            if (!schedule) {
                throw new http_exception_1.HttpException("Scheduling interview failed", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            const response = yield this.jobApplicationRepository.schedule(applicationId);
            if (!response.modifiedCount) {
                throw new http_exception_1.HttpException("Scheduling interview failed", http_status_enum_1.HttpStatus.BAD_REQUEST);
            }
            const notification = {
                type: "interview",
                title: "Interview Scheduled",
                message: `Good news! Your interview for the position of ${application.job.title} at ${(application === null || application === void 0 ? void 0 : application.job).company.name} has been scheduled.`,
                read: false,
                job: application.job._id,
                candidate: application.candidate,
                action: {
                    type: "join",
                    label: "Join Interview",
                    url: meetingLink,
                },
            };
            const newNotification = yield this.notificationRepository.createNotificaton(notification);
            if (newNotification) {
                yield this.notificationService.sendNotification(application.candidate, newNotification);
            }
            return { message: "Interview Scheduled successfully" };
        });
    }
}
exports.ScheduleInterviewUseCase = ScheduleInterviewUseCase;
