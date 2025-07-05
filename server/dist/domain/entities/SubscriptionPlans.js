"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlans = void 0;
class SubscriptionPlans {
    constructor(_id, name, description, monthlyPrice, stripePriceId, features, isActive, createdAt, updatedAt) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.monthlyPrice = monthlyPrice;
        this.stripePriceId = stripePriceId;
        this.features = features;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.SubscriptionPlans = SubscriptionPlans;
