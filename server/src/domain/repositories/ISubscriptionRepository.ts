import { UpdateWriteOpResult } from "mongoose";
import { Subscription } from "../entities/Subscription";
import { CheckoutSession } from "../../infrastructure/database/models/checkOutSessionModal";
export interface ISubscriptionRepository {
  create(plan: Subscription): Promise<Subscription>;
  findByPriceId(priceId: string): Promise<string | null>;
  getCurrentPlan(userId: string): Promise<Subscription | null>;
  getSubscriptions(userId: string): Promise<Subscription[] | null>;
  incrementUsage(
    subscriptionId: string,
    featureKey: string
  ): Promise<UpdateWriteOpResult>;
  getTransactions(): Promise<Subscription[] | null>;
  expireSubscriptions(currentDate: Date): Promise<UpdateWriteOpResult>;
  createCheckoutSession(sessionData: {
    userId: string;
    sessionId: string;
  }): Promise<void>;
  findActiveSession(userId: string): Promise<CheckoutSession | null>;
  updateSessionStatus(
    sessionId: string,
    status: "completed" | "expired"
  ): Promise<void>;
  haveSubscription(companyId: string): Promise<Subscription[]>;
}
