import { ISubscriptionPlanRepository } from "../../../repositories/ISubscriptionPlanRepository";

export class ListSubscriptionUseCase {
  constructor(private SubscriptionPlanRepository: ISubscriptionPlanRepository) {}
  async execute() {
    const plans = await this.SubscriptionPlanRepository.listAll();

    return { message: "Fetched all plans successfully", plans };
  }
}
