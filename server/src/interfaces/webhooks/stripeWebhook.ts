// src/controllers/paymentController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import { SubscriptionRepository } from "../../infrastructure/database/repositories/SubscriptionRepository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_APP_VERSION! as "2025-03-31.basil",
});

const subscriptionRepository = new SubscriptionRepository();

const handleCompletedSession = async (session: Stripe.Checkout.Session) => {
  await subscriptionRepository.updateSessionStatus(session.id, "completed");

  console.log("Payment succeeded:", session);
};

const handleExpiredSession = async (session: Stripe.Checkout.Session) => {
  await subscriptionRepository.updateSessionStatus(session.id, "expired");
  console.log("Checkout session expired:", session.id);
};

// Webhook Handler
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  const payload = req.body;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCompletedSession(event.data.object);
        break;
      case "checkout.session.expired":
        await handleExpiredSession(event.data.object);
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
  } catch (err: any) {
    console.error("Webhook error:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

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
