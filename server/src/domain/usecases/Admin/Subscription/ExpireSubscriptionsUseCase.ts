import { date } from "zod";
import { ISubscriptionRepository } from "../../../repositories/ISubscriptionRepository";

export class ExpireSubscriptionsUseCase {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}
  async execute() {
    const today = new Date();
    const response = this.subscriptionRepository.expireSubscriptions(today);
    return response;
  }
}
