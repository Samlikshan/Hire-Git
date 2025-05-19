import React, { useCallback, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Calendar,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Subscription } from "@/types/Subscription";
import { getSubscriptionHistoryService } from "@/services/subscription";
import { toast } from "sonner";
import { Plan } from "@/types/Plan";
import { formatDate } from "@/lib/utils";

interface RevenueDataPoint {
  label: string;
  revenue: number;
}

interface Metrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  annualRevenue: number;
}

const timeRanges = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last month", value: "1m" },
  { label: "Last 6 months", value: "6m" },
  { label: "Last year", value: "1y" },
  { label: "All time", value: "all" },
];

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(timeRanges[4]);
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionHistory, setSubscriptionHistory] = useState<
    Subscription[]
  >([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 0,
    monthlyRecurringRevenue: 0,
    annualRecurringRevenue: 0,
    annualRevenue: 0,
  });

  useEffect(() => {
    const getSubscriptionHistory = async () => {
      try {
        setLoading(true);
        const response = await getSubscriptionHistoryService(timeRange.value);
        if (response.status === 200) {
          setSubscriptionHistory(response.data.subscriptionsHistory);
          setPlans(response.data.plans);
          setMetrics(response.data.metrics);
          setRevenueData(response.data.revenueData);
        }
      } catch (error) {
        toast.error("Failed to fetch subscription history");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getSubscriptionHistory();
  }, [timeRange]);

  const activeSubscriptionsCount = useCallback(() => {
    return subscriptionHistory.filter((sub) => sub.status === "active").length;
  }, [subscriptionHistory]);

  const planDistributionData = plans
    .map((plan) => ({
      name: plan.name,
      value: subscriptionHistory.filter(
        (sub) => sub.plan._id === plan._id && sub.status === "active"
      ).length,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generate random color
    }))
    .filter((plan) => plan.value > 0);

  const filteredTransactions = subscriptionHistory.filter((transaction) => {
    const matchesPlan =
      planFilter === "all" || transaction.plan._id === planFilter;
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    return matchesPlan && matchesStatus;
  });

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">
            {payload[0].payload.label}
          </p>
          <p className="text-sm text-gray-600">
            ${payload[0].value?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-gray-50">
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Subscription and revenue analytics
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Calendar size={16} className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">{timeRange.label}</span>
              <ChevronDown size={16} className="text-gray-400 ml-2" />
            </button>
            {showTimeRangeDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => {
                      setTimeRange(range);
                      setShowTimeRangeDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm ${
                      timeRange.value === range.value
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue Card */}
          <div className="bg-white rounded-xl p-6 shadow-soft hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              ${metrics.totalRevenue.toFixed(2)}
            </h3>
            <p className="text-gray-500 text-sm">Total Revenue</p>
          </div>

          {/* MRR Card */}
          <div className="bg-white rounded-xl p-6 shadow-soft hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              ${metrics.monthlyRecurringRevenue.toFixed(2)}
            </h3>
            <p className="text-gray-500 text-sm">Monthly Recurring Revenue</p>
          </div>

          {/* ARR Card */}
          <div className="bg-white rounded-xl p-6 shadow-soft hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              ${metrics.annualRecurringRevenue.toFixed(2)}
            </h3>
            <p className="text-gray-500 text-sm">Annual Recurring Revenue</p>
          </div>

          {/* Active Subscriptions Card */}
          <div className="bg-white rounded-xl p-6 shadow-soft hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {activeSubscriptionsCount()}
            </h3>
            <p className="text-gray-500 text-sm">Active Subscriptions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-soft">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Revenue Overview
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="label" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Plan Distribution
              </h2>
            </div>
            <div className="flex flex-col h-80">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {planDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {planDistributionData.map((plan, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: plan.color }}
                      />
                      <span className="text-sm text-gray-600">{plan.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {plan.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Transactions
              </h2>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="canceled">Canceled</option>
                </select>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Plans</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {typeof transaction.userId === "object"
                          ? (transaction.userId as { name: string })?.name
                          : transaction.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.plan.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${transaction.plan.monthlyPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.startedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
