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
exports.NotificationController = void 0;
const GetNotificationsUseCase_1 = require("../../../domain/usecases/Candidate/GetNotificationsUseCase");
const NotificationRepository_1 = require("../../../infrastructure/database/repositories/NotificationRepository");
const http_status_enum_1 = require("../../../domain/enums/http-status.enum");
const GetUnreadNotificationsUseCase_1 = require("../../../domain/usecases/Candidate/GetUnreadNotificationsUseCase");
class NotificationController {
    constructor() {
        this.notificationRepository = new NotificationRepository_1.NotificationRepository();
        this.getNotificationsUseCase = new GetNotificationsUseCase_1.GetNotificationsUseCase(this.notificationRepository);
        this.getUnreadNotificationUseCase = new GetUnreadNotificationsUseCase_1.GetUnReadNotificationsUseCase(this.notificationRepository);
        this.getNotifications = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidateId } = req.params;
                const response = yield this.getNotificationsUseCase.execute(candidateId);
                res.json({
                    message: response.message,
                    notifications: response.notifications,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.getUnreadNotifications = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidateId } = req.params;
                const response = yield this.getUnreadNotificationUseCase.execute(candidateId);
                res.json({
                    message: response.message,
                    notifications: response.notifications,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.markAsRead = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { notificationId } = req.params;
                yield this.notificationRepository.markAsRead(notificationId);
                res
                    .status(http_status_enum_1.HttpStatus.OK)
                    .json({ message: "Notification marked as read" });
            }
            catch (error) {
                next(error);
            }
        });
        this.markAllAsRead = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                yield this.notificationRepository.markAllAsRead(userId);
                res
                    .status(http_status_enum_1.HttpStatus.OK)
                    .json({ message: "All notifications marked as read" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.NotificationController = NotificationController;
