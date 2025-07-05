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
exports.handleWebhook = void 0;
const stripe_1 = __importDefault(require("stripe"));
const SubscriptionRepository_1 = require("../../infrastructure/database/repositories/SubscriptionRepository");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: process.env.STRIPE_APP_VERSION,
});
const subscriptionRepository = new SubscriptionRepository_1.SubscriptionRepository();
const handleCompletedSession = (session) => __awaiter(void 0, void 0, void 0, function* () {
    yield subscriptionRepository.updateSessionStatus(session.id, "completed");
    console.log("Payment succeeded:", session);
});
const handleExpiredSession = (session) => __awaiter(void 0, void 0, void 0, function* () {
    yield subscriptionRepository.updateSessionStatus(session.id, "expired");
    console.log("Checkout session expired:", session.id);
});
// Webhook Handler
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    const payload = req.body;
    try {
        const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
        switch (event.type) {
            case "checkout.session.completed":
                yield handleCompletedSession(event.data.object);
                break;
            case "checkout.session.expired":
                yield handleExpiredSession(event.data.object);
                break;
            case "invoice.paid":
                console.log("Subscription renewed:", event.data.object);
                break;
            case "invoice.payment_failed":
                console.log("Payment failed:", event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        res.status(200).json({ received: true });
    }
    catch (err) {
        console.error("Webhook error:", err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
exports.handleWebhook = handleWebhook;
// export const createCheckoutSession = async (req: Request, res: Response) => {
//   try {
//     const { priceId } = req.body;
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1,
//         },
//       ],
//       mode: "subscription",
//       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//     });
//     // Return session ID and URL correctly
//     res.json({
//       sessionId: session.id,
//       url: session.url, // Add this line
//     });
//   } catch (err: any) {
//     // console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// };
// export const verifyPayment = async (req: Request, res: Response) => {
//   try {
//     const session = await stripe.checkout.sessions.retrieve(
//       req.params.sessionId
//     );
//     res.json({
//       status: session.payment_status,
//       customer: session.customer,
//     });
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// };
