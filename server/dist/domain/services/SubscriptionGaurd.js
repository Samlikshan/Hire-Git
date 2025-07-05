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
exports.SubscriptionGuard = void 0;
class SubscriptionGuard {
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    haveSubscripton(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this.subscriptionRepository.haveSubscription(companyId);
            return subscription.length > 0;
        });
    }
    checkLimit(companyId, featureKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield this.subscriptionRepository.getCurrentPlan(companyId);
            if (!subscription || !subscription.plan.features)
                return false;
            const limit = Number(subscription.plan.features.get(featureKey));
            if (limit === -1)
                return true;
            let used = 0;
            if (featureKey == "jobpost") {
                //change to usage object when there is multiple features
                used = subscription.jobsPostedThisMonth;
            }
            return used < limit;
        });
    }
    incrementUsage(companyId, featureKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.subscriptionRepository.incrementUsage(companyId, featureKey);
        });
    }
}
exports.SubscriptionGuard = SubscriptionGuard;
