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
exports.GetUnReadNotificationsUseCase = void 0;
class GetUnReadNotificationsUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    execute(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.notificationRepository.getUnreadNotifications(candidateId);
            if (!notifications) {
                return { message: "Falied to fetch notifications", notifications: [] };
            }
            return {
                message: "Notifications fetched successfully",
                notifications: notifications,
            };
        });
    }
}
exports.GetUnReadNotificationsUseCase = GetUnReadNotificationsUseCase;
