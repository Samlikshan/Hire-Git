import { ISubscriptionRepository } from "../../../repositories/ISubscriptionRepository";

export class CancelPaymentSessionUseCase {
  constructor(private subscriptoinRepository: ISubscriptionRepository) {}
  async execute(userId: string, sessionId: string) {
    await this.subscriptoinRepository.cancelCheckoutSession({
      userId,
      sessionId,
    });
    return {
      message: "Checkout Session Cancelled Successfully",
    };
  }
}
