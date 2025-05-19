import { SubscriptionPlans } from "../entities/SubscriptionPlans";
import { ISubscriptionRepository } from "../repositories/ISubscriptionRepository";

export class SubscriptionGuard {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async haveSubscripton(companyId: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.haveSubscription(
      companyId
    );
    return subscription.length > 0;
  }

  async checkLimit(companyId: string, featureKey: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.getCurrentPlan(
      companyId
    );
    if (!subscription || !(subscription.plan as SubscriptionPlans).features)
      return false;

    const limit = Number(
      (subscription.plan as SubscriptionPlans).features.get(featureKey)
    );
    if (limit === -1) return true;
    let used = 0;

    if (featureKey == "jobpost") {
      //change to usage object when there is multiple features
      used = subscription.jobsPostedThisMonth;
    }

    return used < limit;
  }

  async incrementUsage(companyId: string, featureKey: string): Promise<void> {
    await this.subscriptionRepository.incrementUsage(companyId, featureKey);
  }
}
