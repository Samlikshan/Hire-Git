import { SubscriptionPlans } from "../../../entities/SubscriptionPlans";
import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { ISubscriptionPlanRepository } from "../../../repositories/ISubscriptionPlanRepository";

export class UpdateSubscriptionUseCase {
  constructor(private SubscriptionPlanRepository: ISubscriptionPlanRepository) {}
  async execute(planId: string, updatedPlan: Partial<SubscriptionPlans>) {
    const response = await this.SubscriptionPlanRepository.update(
      planId,
      updatedPlan
    );
    if (response.modifiedCount) {
      return { message: "Plan updated successfully" };
    }
    throw new HttpException(
      "Plan updated failed, Please try again ",
      HttpStatus.BAD_REQUEST
    );
  }
}
