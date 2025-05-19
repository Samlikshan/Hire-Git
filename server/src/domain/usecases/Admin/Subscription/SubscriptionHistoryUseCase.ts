import Stripe from "stripe";
import { ISubscriptionPlanRepository } from "../../../repositories/ISubscriptionPlanRepository";
import { ISubscriptionRepository } from "../../../repositories/ISubscriptionRepository";

export class SubscriptionHistoryUseCase {
  constructor(
    private stripe: Stripe,
    private subscriptionRepository: ISubscriptionRepository,
    private subscriptionPlansRepository: ISubscriptionPlanRepository
  ) {}

  async execute(filterBy: "7d" | "1m" | "6m" | "1y" | "all" = "all") {
    const [plans, allPaidInvoices, mrr] = await Promise.all([
      this.subscriptionPlansRepository.listAll(),
      this.getAllPaidInvoices(),
      this.calculateMRR(),
    ]);

    const filteredInvoices = this.filterInvoicesByTimeRange(
      allPaidInvoices,
      filterBy
    );
    const subscriptionsHistory =
      await this.subscriptionRepository.getTransactions();

    const totalRevenue = this.calculateTotalRevenue(filteredInvoices);
    const annualRevenue = this.calculateAnnualRevenue(allPaidInvoices);
    const revenueData = this.getRevenueData(filteredInvoices, filterBy);
    const annualRecurringRevenue = mrr * 12;

    return {
      message: "Subscription history fetched successfully",
      subscriptionsHistory,
      plans,
      metrics: {
        totalRevenue,
        monthlyRecurringRevenue: mrr,
        annualRecurringRevenue,
        annualRevenue,
      },
      revenueData,
    };
  }

  private async getAllPaidInvoices(): Promise<Stripe.Invoice[]> {
    let invoices: Stripe.Invoice[] = [];
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const response: Stripe.ApiList<Stripe.Invoice> =
        await this.stripe.invoices.list({
          status: "paid",
          limit: 100,
          ...(startingAfter && { starting_after: startingAfter }),
        });

      invoices = invoices.concat(response.data);
      hasMore = response.has_more;
      startingAfter =
        hasMore && response.data.length > 0
          ? response.data[response.data.length - 1].id
          : undefined;
    }

    return invoices;
  }

  private calculateTotalRevenue(invoices: Stripe.Invoice[]): number {
    return (
      invoices.reduce((acc, invoice) => acc + (invoice.amount_paid ?? 0), 0) /
      100
    );
  }

  private filterInvoicesByTimeRange(
    invoices: Stripe.Invoice[],
    range: "7d" | "1m" | "6m" | "1y" | "all"
  ): Stripe.Invoice[] {
    if (range === "all") return invoices;

    const now = Date.now();
    let from: number;

    switch (range) {
      case "7d":
        from = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "1m":
        from = new Date(
          new Date().setMonth(new Date().getMonth() - 1)
        ).getTime();
        break;
      case "6m":
        from = new Date(
          new Date().setMonth(new Date().getMonth() - 6)
        ).getTime();
        break;
      case "1y":
        from = new Date(
          new Date().setFullYear(new Date().getFullYear() - 1)
        ).getTime();
        break;
    }

    const fromUnix = Math.floor(from / 1000);
    return invoices.filter((invoice) => invoice.created >= fromUnix);
  }

  private async calculateMRR(): Promise<number> {
    let mrr = 0;
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: "active",
        limit: 100,
        ...(startingAfter && { starting_after: startingAfter }),
      };

      const subscriptions = await this.stripe.subscriptions.list(params);

      for (const sub of subscriptions.data) {
        for (const item of sub.items.data) {
          const price = item.price;

          if (!price?.recurring?.interval || !price.unit_amount) continue;

          let monthlyAmount = price.unit_amount;

          switch (price.recurring.interval) {
            case "year":
              monthlyAmount /= 12;
              break;
            case "week":
              monthlyAmount = (monthlyAmount * 52) / 12;
              break;
            case "day":
              monthlyAmount = (monthlyAmount * 365) / 12;
              break;
            case "month":
            default:
              break;
          }

          mrr += monthlyAmount;
        }
      }

      hasMore = subscriptions.has_more;
      startingAfter =
        hasMore && subscriptions.data.length > 0
          ? subscriptions.data[subscriptions.data.length - 1].id
          : undefined;
    }

    return mrr / 100;
  }

  private getRevenueData(
    invoices: Stripe.Invoice[],
    range: "7d" | "1m" | "6m" | "1y" | "all"
  ): {
    label: string;
    revenue: number;
  }[] {
    const buckets: { [key: string]: number } = {};

    for (const invoice of invoices) {
      const date = new Date(invoice.created * 1000);
      let key: string;

      switch (range) {
        case "7d":
          key = date.toLocaleDateString();
          break;
        case "1m":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - (date.getDay() || 7) + 1);
          key = `Week of ${weekStart.toLocaleDateString()}`;
          break;
        case "6m":
        case "1y":
        case "all":
          key = `${date.toLocaleString("default", {
            month: "short",
          })} ${date.getFullYear()}`;
          break;
      }

      if (!buckets[key]) buckets[key] = 0;
      buckets[key] += invoice.amount_paid ?? 0;
    }

    return Object.entries(buckets).map(([label, amount]) => ({
      label,
      revenue: amount / 100,
    }));
  }

  private calculateAnnualRevenue(invoices: Stripe.Invoice[]): number {
    const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;
    const filtered = invoices.filter((inv) => inv.created >= oneYearAgo);
    return (
      filtered.reduce((acc, invoice) => acc + (invoice.amount_paid ?? 0), 0) /
      100
    );
  }
}

function getLastSixMonths() {
  const now = new Date();
  const result: { month: string; start: number; end: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString("default", { month: "short" });

    const start = Math.floor(date.getTime() / 1000);
    const end = Math.floor(
      new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() / 1000
    );

    result.push({ month: monthName, start, end });
  }

  return result;
}
