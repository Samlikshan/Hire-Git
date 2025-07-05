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
exports.NotificationRepository = void 0;
const notificationModel_1 = require("../models/notificationModel");
class NotificationRepository {
    createNotificaton(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            return notificationModel_1.NotificationModel.create(notificationData);
        });
    }
    getUnreadNotifications(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return notificationModel_1.NotificationModel.find({ candidate: candidateId, read: false })
                .populate({ path: "job", populate: { path: "company" } })
                .sort({
                timeStamp: -1,
            });
        });
    }
    getNotificatons(candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return notificationModel_1.NotificationModel.find({ candidate: candidateId })
                .populate({ path: "job", populate: { path: "company" } })
                .sort({
                timeStamp: -1,
            });
        });
    }
    markAsRead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield notificationModel_1.NotificationModel.findByIdAndUpdate(id, { read: true });
        });
    }
    markAllAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield notificationModel_1.NotificationModel.updateMany({ candidate: userId, read: false }, { $set: { read: true } });
        });
    }
}
exports.NotificationRepository = NotificationRepository;
