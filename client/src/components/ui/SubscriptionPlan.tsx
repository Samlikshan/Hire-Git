import React, { useEffect, useState } from "react";
import PlanCard from "./MyPlanCard";
import SubscriptionStatus from "./SubscriptionStatus";
import UsageStats from "./UsageStatus";
import SubscriptionHistory from "./SubscriptionHistory";
// import PlanActions from "./PlanActions";
import { getMySubscriptionsService } from "@/services/subscription";
import { Subscription } from "@/types/Subscription";
import UpgradeBanner from "./UpgradeBanner";

const SubscriptionPlan: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<Subscription>();
  const [subscriptions, setSubscriptoins] = useState<Subscription[]>([]);
  useEffect(() => {
    const fetchMySubscriptions = async () => {
      const response = await getMySubscriptionsService();
      if (response.status == 200) {
        setCurrentPlan(response.data.currentPlan);
        setSubscriptoins(response.data.subscriptions);
      }
    };
    fetchMySubscriptions();
  }, []);
  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Subscription</h1>
      {currentPlan && (
        <UpgradeBanner
          currentPlan={currentPlan.plan.name}
          price={currentPlan.plan.monthlyPrice}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Plan details */}
        <div className="lg:col-span-2 space-y-6">
          <PlanCard plan={currentPlan?.plan} />
          <SubscriptionStatus
            startedDate={currentPlan?.startedAt}
            nextBillingDate={currentPlan?.nextBillingDate}
          />
          <UsageStats
            // usage={subscriptionData.usage}
            jobsPosted={currentPlan?.jobsPostedThisMonth}
            jobsAllowed={Number(currentPlan?.plan.features.jobpost)}
          />
        </div>

        {/* Right column - Actions and history */}
        <div className="space-y-6">
          {/* <PlanActions
            isActive={subscriptionData.plan.isActive}
            paymentMethod={subscriptionData.paymentMethod}
          /> */}
          <SubscriptionHistory subscriptions={subscriptions} />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
