import { UpdateWriteOpResult } from "mongoose";
import { Subscription } from "../../../domain/entities/Subscription";
import { ISubscriptionRepository } from "../../../domain/repositories/ISubscriptionRepository";
import { SubscriptionModel } from "../models/SubscriptionModel";
import { SubscriptionPlanModel } from "../models/subscriptionPlansModel";
import CheckoutSessionModel, {
  CheckoutSession,
} from "../models/checkOutSessionModal";
export class SubscriptionRepository implements ISubscriptionRepository {
  async create(plan: Subscription): Promise<Subscription> {
    await SubscriptionModel.updateMany(
      { status: "active" },
      { $set: { status: "canceled" } }
    );
    return await SubscriptionModel.create(plan);
  }
  async findByPriceId(priceId: string): Promise<string | null> {
    const doc = await SubscriptionPlanModel.findOne({
      stripePriceId: priceId,
    }).select("_id");
    return doc?._id?.toString() || null;
  }
  async getCurrentPlan(userId: string): Promise<Subscription | null> {
    return await SubscriptionModel.findOne({
      userId: userId,
      status: "active",
    }).populate("plan");
  }
  async getSubscriptions(userId: String): Promise<Subscription[] | null> {
    return await SubscriptionModel.find({
      userId: userId,
      // status: "expired",
    })
      .sort({ createdAt: -1 })
      .populate("plan");
  }
  async incrementUsage(
    subscriptionId: string,
    featureKey: string
  ): Promise<UpdateWriteOpResult> {
    return await SubscriptionModel.updateOne(
      { userId: subscriptionId, status: "active" },
      { $inc: { jobsPostedThisMonth: 1 } }
    );
  }
  async getTransactions(): Promise<Subscription[] | null> {
    return await SubscriptionModel.find()
      .sort({ createdAt: -1 })
      .populate("userId plan");
  }

  async expireSubscriptions(currentDate: Date): Promise<UpdateWriteOpResult> {
    return await SubscriptionModel.updateMany(
      {
        nextBillingDate: { $lt: currentDate },
      },
      { $set: { status: "expired" } }
    );
  }

  async createCheckoutSession(sessionData: {
    userId: string;
    sessionId: string;
  }): Promise<void> {
    await CheckoutSessionModel.create(sessionData);
  }

  async findActiveSession(userId: string): Promise<CheckoutSession | null> {
    return CheckoutSessionModel.findOne({
      userId,
      status: "pending",
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Sessions expire after 24h
    });
  }

  async updateSessionStatus(
    sessionId: string,
    status: "completed" | "expired"
  ): Promise<void> {
    await CheckoutSessionModel.updateOne(
      { sessionId },
      { $set: { status, updatedAt: new Date() } }
    );
  }

  async haveSubscription(companyId: string): Promise<Subscription[]> {
    return await SubscriptionModel.find({ userId: companyId });
  }
}
