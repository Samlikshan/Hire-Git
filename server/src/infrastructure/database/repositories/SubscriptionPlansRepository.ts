import { UpdateWriteOpResult } from "mongoose";
import { SubscriptionPlans } from "../../../domain/entities/SubscriptionPlans";
import { ISubscriptionPlanRepository } from "../../../domain/repositories/ISubscriptionPlanRepository";
import { SubscriptionPlanModel } from "../models/subscriptionPlansModel";

export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
  async create(plan: SubscriptionPlans): Promise<SubscriptionPlans> {
    return await SubscriptionPlanModel.create(plan);
  }
  async findById(planId: string): Promise<SubscriptionPlans | null> {
    return await SubscriptionPlanModel.findOne({ _id: planId });
  }
  async listAll(): Promise<SubscriptionPlans[]> {
    return await SubscriptionPlanModel.find({ isDeleted: false });
  }
  async update(
    planId: string,
    updateDate: Partial<SubscriptionPlans>
  ): Promise<UpdateWriteOpResult> {
    return await SubscriptionPlanModel.updateOne(
      { _id: planId },
      { $set: { ...updateDate } }
    );
  }
  async delete(planId: string): Promise<UpdateWriteOpResult> {
    return await SubscriptionPlanModel.updateOne(
      { _id: planId },
      { $set: { isDeleted: true } }
    );
  }
}
