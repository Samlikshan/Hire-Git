import { ISubscriptionRepository } from "../../../repositories/ISubscriptionRepository";

export class MySubScriptoinsUseCase {
  constructor(private subscriptoinRepository: ISubscriptionRepository) {}
  async execute(userId: string) {
    const currentPlan = await this.subscriptoinRepository.getCurrentPlan(
      userId
    );
    const subscriptions = await this.subscriptoinRepository.getSubscriptions(
      userId
    );
    return {
      message: "Fetched subscriptons successfully",
      currentPlan,
      subscriptions,
    };
  }
}
