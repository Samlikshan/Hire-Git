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
exports.CronJobService = void 0;
const ExpireSubscriptionsUseCase_1 = require("../../domain/usecases/Admin/Subscription/ExpireSubscriptionsUseCase");
const SubscriptionRepository_1 = require("../database/repositories/SubscriptionRepository");
// src/infrastructure/cron/CronJob.js
const node_cron_1 = __importDefault(require("node-cron"));
// Initialize repository and use case
class CronJobService {
    constructor() {
        this.subscriptionRepository = new SubscriptionRepository_1.SubscriptionRepository();
        this.expireSubscriptionsUseCase = new ExpireSubscriptionsUseCase_1.ExpireSubscriptionsUseCase(this.subscriptionRepository);
    }
    // Set up the cron job to run at midnight every day
    subscriptionExpiration() {
        return __awaiter(this, void 0, void 0, function* () {
            node_cron_1.default.schedule("0 0 * * *", () => __awaiter(this, void 0, void 0, function* () {
                console.log("Running subscription expiration task...");
                try {
                    const response = yield this.expireSubscriptionsUseCase.execute();
                    console.log(response, "subscription expired response");
                }
                catch (error) {
                    console.error("Error expiring subscriptions:", error);
                }
            }));
        });
    }
}
exports.CronJobService = CronJobService;
