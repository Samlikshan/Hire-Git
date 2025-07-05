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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepository = void 0;
const SubscriptionModel_1 = require("../models/SubscriptionModel");
const subscriptionPlansModel_1 = require("../models/subscriptionPlansModel");
const checkOutSessionModal_1 = __importDefault(require("../models/checkOutSessionModal"));
class SubscriptionRepository {
    create(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SubscriptionModel_1.SubscriptionModel.updateMany({ status: "active" }, { $set: { status: "canceled" } });
            return yield SubscriptionModel_1.SubscriptionModel.create(plan);
        });
    }
    findByPriceId(priceId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doc = yield subscriptionPlansModel_1.SubscriptionPlanModel.findOne({
                stripePriceId: priceId,
            }).select("_id");
            return ((_a = doc === null || doc === void 0 ? void 0 : doc._id) === null || _a === void 0 ? void 0 : _a.toString()) || null;
        });
    }
    getCurrentPlan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SubscriptionModel_1.SubscriptionModel.findOne({
                userId: userId,
                status: "active",
            }).populate("plan");
        });
    }
    getSubscriptions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SubscriptionModel_1.SubscriptionModel.find({
                userId: userId,
                // status: "expired",
            })
                .sort({ createdAt: -1 })
                .populate("plan");
        });
    }
    incrementUsage(subscriptionId, featureKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SubscriptionModel_1.SubscriptionModel.updateOne({ userId: subscriptionId, status: "active" }, { $inc: { jobsPostedThisMonth: 1 } });
        });
    }
    getTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SubscriptionModel_1.SubscriptionModel.find()
                .sort({ createdAt: -1 })
                .populate("userId plan");
        });
    }
    expireSubscriptions(currentDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SubscriptionModel_1.SubscriptionModel.updateMany({
                nextBillingDate: { $lt: currentDate },
            }, { $set: { status: "expired" } });
        });
    }
    createCheckoutSession(sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield checkOutSessionModal_1.default.create(sessionData);
        });
    }
    cancelCheckoutSession(sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield checkOutSessionModal_1.default.updateOne({
                userId: sessionData.userId,
                sessionId: sessionData.sessionId,
            }, { $set: { status: "cancelled" } });
        });
    }
    findActiveSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return checkOutSessionModal_1.default.findOne({
                userId,
                status: "pending",
                createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Sessions expire after 24h
            });
        });
    }
    updateSessionStatus(sessionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield checkOutSessionModal_1.default.updateOne({ sessionId }, { $set: { status, updatedAt: new Date() } });
        });
    }
    haveSubscription(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SubscriptionModel_1.SubscriptionModel.find({ userId: companyId });
        });
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
