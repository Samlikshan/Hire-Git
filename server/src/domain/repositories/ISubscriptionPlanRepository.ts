import { UpdateWriteOpResult } from "mongoose";
import { SubscriptionPlans } from "../entities/SubscriptionPlans";

export interface ISubscriptionPlanRepository {
  create(plan: SubscriptionPlans): Promise<SubscriptionPlans>;
  findById(planId: string): Promise<SubscriptionPlans | null>;
  listAll(): Promise<SubscriptionPlans[]>;
  update(
    planId: string,
    updateDate: Partial<SubscriptionPlans>
  ): Promise<UpdateWriteOpResult>;
  delete(planId: string): Promise<UpdateWriteOpResult>;
}
