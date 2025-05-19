import { SubscriptionPlans } from "../../../entities/SubscriptionPlans";
import { ISubscriptionPlanRepository } from "../../../repositories/ISubscriptionPlanRepository";

export class CreateSubscriptionUseCase {
  constructor(
    private SubscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}
  async execute(plan: SubscriptionPlans) {
    const newPlan = await this.SubscriptionPlanRepository.create(plan);

    return { message: "New plan created successfully", newPlan };
  }
}
