import Stripe from "stripe";
import { ISubscriptionRepository } from "../../../repositories/ISubscriptionRepository";

export class SubscriptionCheckoutUseCase {
  constructor(
    private stripe: Stripe,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(userId: string, sessionId: string) {
    const existingSession = await this.subscriptionRepository.findActiveSession(
      userId
    );
    if (existingSession) {
      throw new Error("You already have an active checkout session");
    }
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    const subscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const planId = await this.subscriptionRepository.findByPriceId(
      subscription.items.data[0].price.id
    );

    const invoices = await this.stripe.invoices.list({
      subscription: subscription.id,
      limit: 1,
    });

    const invoicePdfUrl = invoices.data[0]?.invoice_pdf || null;

    const startDate = new Date(subscription.start_date * 1000);
    const nextBillingDate = new Date(startDate);
    nextBillingDate.setDate(nextBillingDate.getDate() + 28);

    const newSubscription = {
      userId: userId,
      plan: planId!,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionItemId: subscription.items.data[0].id,
      status: "active" as "active" | "canceled" | "expired",
      startedAt: startDate,
      nextBillingDate: nextBillingDate,
      invoiceId: session.invoice as string,
      invoice: invoicePdfUrl || "",
      jobsPostedThisMonth: 0,
    };

    await this.subscriptionRepository.create(newSubscription);

    return {
      message: "Subscribed to plan successfully",
      status: session.payment_status,
      customer: session.customer,
    };
  }
}
