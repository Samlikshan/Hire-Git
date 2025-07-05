"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
class Subscription {
    constructor(userId, stripeCustomerId, stripeSubscriptionItemId, stripeSubscriptionId, plan, status, startedAt, nextBillingDate, jobsPostedThisMonth, // public cancelledDate: Date,
    invoiceId, invoice, createdAt, updatedAt, _id) {
        this.userId = userId;
        this.stripeCustomerId = stripeCustomerId;
        this.stripeSubscriptionItemId = stripeSubscriptionItemId;
        this.stripeSubscriptionId = stripeSubscriptionId;
        this.plan = plan;
        this.status = status;
        this.startedAt = startedAt;
        this.nextBillingDate = nextBillingDate;
        this.jobsPostedThisMonth = jobsPostedThisMonth;
        this.invoiceId = invoiceId;
        this.invoice = invoice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this._id = _id;
    }
}
exports.Subscription = Subscription;
