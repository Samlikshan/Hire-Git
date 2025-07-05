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
exports.CreateSubscriptionCheckoutUseCase = void 0;
const http_exception_1 = require("../../../enums/http-exception");
const http_status_enum_1 = require("../../../enums/http-status.enum");
class CreateSubscriptionCheckoutUseCase {
    constructor(stripe, subscriptionRepository) {
        this.stripe = stripe;
        this.subscriptionRepository = subscriptionRepository;
    }
    execute(priceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSession = yield this.subscriptionRepository.findActiveSession(userId);
            if (existingSession) {
                throw new http_exception_1.HttpException("You already have an active checkout session", http_status_enum_1.HttpStatus.FORBIDDEN);
            }
            const session = yield this.stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: "subscription",
                success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CLIENT_URL}/subscription/cancel?session_id={CHECKOUT_SESSION_ID}`,
            });
            yield this.subscriptionRepository.createCheckoutSession({
                userId,
                sessionId: session.id,
            });
            return {
                message: "Subscribed to plan successfully",
                sessionId: session.id,
                url: session.url,
            };
        });
    }
}
exports.CreateSubscriptionCheckoutUseCase = CreateSubscriptionCheckoutUseCase;
