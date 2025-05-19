import Stripe from "stripe";
import { Subscription } from "../../../entities/Subscription";
import { ISubscriptionRepository } from "../../../repositories/ISubscriptionRepository";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";

export class CreateSubscriptionCheckoutUseCase {
  constructor(
    private stripe: Stripe,
    private subscriptionRepository: ISubscriptionRepository
  ) {}
  async execute(priceId: string, userId: string) {
    const existingSession = await this.subscriptionRepository.findActiveSession(
      userId
    );
    if (existingSession) {
      throw new HttpException(
        "You already have an active checkout session",
        HttpStatus.FORBIDDEN
      );
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    await this.subscriptionRepository.createCheckoutSession({
      userId,
      sessionId: session.id,
    });
    return {
      message: "Subscribed to plan successfully",
      sessionId: session.id,
      url: session.url,
    };
  }
}
