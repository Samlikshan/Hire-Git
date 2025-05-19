import { ExpireSubscriptionsUseCase } from "../../domain/usecases/Admin/Subscription/ExpireSubscriptionsUseCase";
import { SubscriptionRepository } from "../database/repositories/SubscriptionRepository";

// src/infrastructure/cron/CronJob.js
import cron from "node-cron";
// Initialize repository and use case

export class CronJobService {
  private subscriptionRepository = new SubscriptionRepository();
  private expireSubscriptionsUseCase = new ExpireSubscriptionsUseCase(
    this.subscriptionRepository
  );

  // Set up the cron job to run at midnight every day
  async subscriptionExpiration() {
    cron.schedule("0 0 * * *", async () => {
      console.log("Running subscription expiration task...");
      try {
        const response = await this.expireSubscriptionsUseCase.execute();
        console.log(response, "subscription expired response");
      } catch (error) {
        console.error("Error expiring subscriptions:", error);
      }
    });
  }
}
