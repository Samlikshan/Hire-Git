import mongoose from "mongoose";

export class SubscriptionPlans {
  constructor(
    public _id: mongoose.Types.ObjectId,
    public name: string,
    public description: string,
    public monthlyPrice: number,
    public stripePriceId: string,
    public features: Map<string, number | string>,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
