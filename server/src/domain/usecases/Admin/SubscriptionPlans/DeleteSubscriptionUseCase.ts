import { HttpException } from "../../../enums/http-exception";
import { HttpStatus } from "../../../enums/http-status.enum";
import { ISubscriptionPlanRepository } from "../../../repositories/ISubscriptionPlanRepository";

export class DeleteSubscriptionUseCase {
  constructor(private SubscriptionPlanRepository: ISubscriptionPlanRepository) {}
  async execute(planId: string) {
    const response = await this.SubscriptionPlanRepository.delete(planId);
    if (response.modifiedCount) {
      return { message: "Plan deleted successfully" };
    }
    throw new HttpException(
      "Plan deletion failed, Please try again ",
      HttpStatus.BAD_REQUEST
    );
  }
}
