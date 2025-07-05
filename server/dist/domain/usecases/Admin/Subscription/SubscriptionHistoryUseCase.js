"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionHistoryUseCase = void 0;
class SubscriptionHistoryUseCase {
    constructor(stripe, subscriptionRepository, subscriptionPlansRepository) {
        this.stripe = stripe;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionPlansRepository = subscriptionPlansRepository;
    }
    execute() {
        return __awaiter(this, arguments, void 0, function* (filterBy = "all") {
            const [plans, allPaidInvoices, mrr] = yield Promise.all([
                this.subscriptionPlansRepository.listAll(),
                this.getAllPaidInvoices(),
                this.calculateMRR(),
            ]);
            const filteredInvoices = this.filterInvoicesByTimeRange(allPaidInvoices, filterBy);
            const subscriptionsHistory = yield this.subscriptionRepository.getTransactions();
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
        });
    }
    getAllPaidInvoices() {
        return __awaiter(this, void 0, void 0, function* () {
            let invoices = [];
            let hasMore = true;
            let startingAfter = undefined;
            while (hasMore) {
                const response = yield this.stripe.invoices.list(Object.assign({ status: "paid", limit: 100 }, (startingAfter && { starting_after: startingAfter })));
                invoices = invoices.concat(response.data);
                hasMore = response.has_more;
                startingAfter =
                    hasMore && response.data.length > 0
                        ? response.data[response.data.length - 1].id
                        : undefined;
            }
            return invoices;
        });
    }
    calculateTotalRevenue(invoices) {
        return (invoices.reduce((acc, invoice) => { var _a; return acc + ((_a = invoice.amount_paid) !== null && _a !== void 0 ? _a : 0); }, 0) /
            100);
    }
    filterInvoicesByTimeRange(invoices, range) {
        if (range === "all")
            return invoices;
        const now = Date.now();
        let from;
        switch (range) {
            case "7d":
                from = now - 7 * 24 * 60 * 60 * 1000;
                break;
            case "1m":
                from = new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime();
                break;
            case "6m":
                from = new Date(new Date().setMonth(new Date().getMonth() - 6)).getTime();
                break;
            case "1y":
                from = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getTime();
                break;
        }
        const fromUnix = Math.floor(from / 1000);
        return invoices.filter((invoice) => invoice.created >= fromUnix);
    }
    calculateMRR() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let mrr = 0;
            let hasMore = true;
            let startingAfter = undefined;
            while (hasMore) {
                const params = Object.assign({ status: "active", limit: 100 }, (startingAfter && { starting_after: startingAfter }));
                const subscriptions = yield this.stripe.subscriptions.list(params);
                for (const sub of subscriptions.data) {
                    for (const item of sub.items.data) {
                        const price = item.price;
                        if (!((_a = price === null || price === void 0 ? void 0 : price.recurring) === null || _a === void 0 ? void 0 : _a.interval) || !price.unit_amount)
                            continue;
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
        });
    }
    getRevenueData(invoices, range) {
        var _a;
        const buckets = {};
        for (const invoice of invoices) {
            const date = new Date(invoice.created * 1000);
            let key;
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
            if (!buckets[key])
                buckets[key] = 0;
            buckets[key] += (_a = invoice.amount_paid) !== null && _a !== void 0 ? _a : 0;
        }
        return Object.entries(buckets).map(([label, amount]) => ({
            label,
            revenue: amount / 100,
        }));
    }
    calculateAnnualRevenue(invoices) {
        const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;
        const filtered = invoices.filter((inv) => inv.created >= oneYearAgo);
        return (filtered.reduce((acc, invoice) => { var _a; return acc + ((_a = invoice.amount_paid) !== null && _a !== void 0 ? _a : 0); }, 0) /
            100);
    }
}
exports.SubscriptionHistoryUseCase = SubscriptionHistoryUseCase;
function getLastSixMonths() {
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleString("default", { month: "short" });
        const start = Math.floor(date.getTime() / 1000);
        const end = Math.floor(new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() / 1000);
        result.push({ month: monthName, start, end });
    }
    return result;
}
