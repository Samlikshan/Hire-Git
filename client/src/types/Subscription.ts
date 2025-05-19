import { Plan } from "./Plan";

export interface Subscription {
  _id: string;
  userId:
    | string
    | {
        name: string;
        logo: string;
      };
  status: "active" | "canceled" | "expired";
  startedAt: Date;
  nextBillingDate: Date;
  jobsPostedThisMonth: number;
  stripeCustomerId: string;
  invoiceId: string;
  invoice: string;
  plan: Plan;
}
