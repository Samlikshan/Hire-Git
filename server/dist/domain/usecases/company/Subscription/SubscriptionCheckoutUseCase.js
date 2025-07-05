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
exports.SubscriptionCheckoutUseCase = void 0;
class SubscriptionCheckoutUseCase {
    constructor(stripe, subscriptionRepository) {
        this.stripe = stripe;
        this.subscriptionRepository = subscriptionRepository;
    }
    execute(userId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const existingSession = yield this.subscriptionRepository.findActiveSession(userId);
            if (existingSession) {
                throw new Error("You already have an active checkout session");
            }
            const session = yield this.stripe.checkout.sessions.retrieve(sessionId);
            const subscription = yield this.stripe.subscriptions.retrieve(session.subscription);
            const planId = yield this.subscriptionRepository.findByPriceId(subscription.items.data[0].price.id);
            const invoices = yield this.stripe.invoices.list({
                subscription: subscription.id,
                limit: 1,
            });
            const invoicePdfUrl = ((_a = invoices.data[0]) === null || _a === void 0 ? void 0 : _a.invoice_pdf) || null;
            const startDate = new Date(subscription.start_date * 1000);
            const nextBillingDate = new Date(startDate);
            nextBillingDate.setDate(nextBillingDate.getDate() + 28);
            const newSubscription = {
                userId: userId,
                plan: planId,
                stripeCustomerId: session.customer,
                stripeSubscriptionId: subscription.id,
                stripeSubscriptionItemId: subscription.items.data[0].id,
                status: "active",
                startedAt: startDate,
                nextBillingDate: nextBillingDate,
                invoiceId: session.invoice,
                invoice: invoicePdfUrl || "",
                jobsPostedThisMonth: 0,
            };
            yield this.subscriptionRepository.create(newSubscription);
            return {
                message: "Subscribed to plan successfully",
                status: session.payment_status,
                customer: session.customer,
            };
        });
    }
}
exports.SubscriptionCheckoutUseCase = SubscriptionCheckoutUseCase;
