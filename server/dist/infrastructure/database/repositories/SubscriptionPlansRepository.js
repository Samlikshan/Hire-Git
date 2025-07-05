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
exports.SubscriptionPlanRepository = void 0;
const subscriptionPlansModel_1 = require("../models/subscriptionPlansModel");
class SubscriptionPlanRepository {
    create(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlansModel_1.SubscriptionPlanModel.create(plan);
        });
    }
    findById(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlansModel_1.SubscriptionPlanModel.findOne({ _id: planId });
        });
    }
    listAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlansModel_1.SubscriptionPlanModel.find({ isDeleted: false }).sort({
                monthlyPrice: 1,
            });
        });
    }
    update(planId, updateDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlansModel_1.SubscriptionPlanModel.updateOne({ _id: planId }, { $set: Object.assign({}, updateDate) });
        });
    }
    delete(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlansModel_1.SubscriptionPlanModel.updateOne({ _id: planId }, { $set: { isDeleted: true } });
        });
    }
}
exports.SubscriptionPlanRepository = SubscriptionPlanRepository;
