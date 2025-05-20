import React, { useEffect, useState } from "react";
import PlanCard from "@/components/ui/PlanCard";
import PricingTable from "@/components/ui/PricingTable";
// import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Users,
  TriangleAlert,
} from "lucide-react";
import { Plan } from "@/types/Plan";
import {
  getMySubscriptionsService,
  listSubscriptionsService,
} from "@/services/subscription";
import Navbar from "../ui/navbar";
import { Subscription } from "@/types/Subscription";
import { Link } from "react-router-dom";

const UserSubscriptionPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Subscription | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      const subscriptionsResponse = await listSubscriptionsService();
      const currentSubResponse = await getMySubscriptionsService();

      if (subscriptionsResponse.status === 200) {
        setSubscriptions(subscriptionsResponse.data.plans);
      }
      if (currentSubResponse.status === 200) {
        setCurrentPlan(currentSubResponse.data.currentPlan);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Current Plan Banner */}
      {currentPlan && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <TriangleAlert className="h-5 w-5 text-yellow-400 mr-3" />
              <p className="text-yellow-700">
                You're currently subscribed to the {currentPlan.plan.name} plan
                ($
                {currentPlan.plan.monthlyPrice}/month). Purchasing a new plan
                will replace your existing subscription immediately.
              </p>
            </div>
            {/* <Link
              to="/subscriptions"
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Plans
            </Link> */}
          </div>
        </div>
      )}

      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMjggNjZMMCA1MEwyOCAzNGwyOCAxNkwyOCA2NnpNMjggMzRMMCA1MEwyOCA2NmwyOC0xNkwyOCAzNHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDciLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find the Perfect Plan for Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-100 to-green-400">
              Hiring Success
            </span>
          </h1>
          <button
            className="inline-flex items-center bg-white text-blue-600 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() =>
              document
                .getElementById("pricing-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Plans <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 relative -mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Matching",
                description: "Smart algorithms find your perfect candidates",
              },
              {
                icon: Shield,
                title: "Secure Platform",
                description: "Enterprise-grade security for your data",
              },
              {
                icon: Clock,
                title: "Quick Setup",
                description: "Get started in minutes, not days",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Seamless hiring team coordination",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing-section"
        className="py-20 px-4 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Select the perfect subscription plan for your company's needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {subscriptions.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                currentPlanId={currentPlan?.plan?._id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Feature Comparison</h2>
            <PricingTable plans={subscriptions} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserSubscriptionPage;
