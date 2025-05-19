import mongoose from "mongoose";
import { SubscriptionPlans } from "./SubscriptionPlans";

export class Subscription {
  constructor(
    public userId: string,
    public stripeCustomerId: string,
    public stripeSubscriptionItemId: string,
    public stripeSubscriptionId: string,
    public plan: string | SubscriptionPlans,
    public status: "active" | "canceled" | "expired",
    public startedAt: Date,
    public nextBillingDate: Date,
    public jobsPostedThisMonth: number, // public cancelledDate: Date,
    public invoiceId: string,
    public invoice: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public _id?: mongoose.Types.ObjectId
  ) {}
}
