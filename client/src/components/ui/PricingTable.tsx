import React, { useState } from "react";
import { Check, X, HelpCircle } from "lucide-react";
import { Plan } from "@/types/Plan";

interface PricingTableProps {
  plans: Plan[];
}

const PricingTable: React.FC<PricingTableProps> = ({ plans }) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // All unique features across all plans
  const allFeatures = Array.from(
    new Set(
      plans.flatMap((plan) => (plan.features ? Object.keys(plan.features) : []))
    )
  );

  // Group features by category for better organization
  const featureCategories = {
    "Core Features": allFeatures.filter((f) => f.includes("core")),
    "Recruitment Tools": allFeatures.filter((f) => f.includes("recruit")),
    Analytics: allFeatures.filter((f) => f.includes("analytics")),
    Support: allFeatures.filter((f) => f.includes("support")),
    Other: allFeatures.filter(
      (f) =>
        !f.includes("core") &&
        !f.includes("recruit") &&
        !f.includes("analytics") &&
        !f.includes("support")
    ),
  };

  const tooltips = {
    core_job_postings: "Number of active job postings you can have at any time",
    core_candidates: "Maximum number of candidate profiles you can store",
    recruit_ai_matching: "AI-powered candidate matching to job requirements",
    analytics_reports: "Advanced hiring analytics and custom reports",
    support_priority: "Priority customer support with faster response times",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 bg-gray-50 border-b">Features</th>
            {plans.map((plan) => (
              <th
                key={plan._id}
                className={`p-4 text-center border-b ${
                  plan.isPopular ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                <div className="font-semibold text-lg text-gray-900">
                  {plan.name}
                </div>
                <div className="font-bold text-2xl my-2">
                  ${plan.monthlyPrice}
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                </div>
                {/* Future: Add annual pricing when available in the Plan type */}
                {/* <div className="text-sm text-gray-500">
                  ${plan.annualPrice}/yr
                </div> */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(featureCategories).map(
            ([category, features]) =>
              features.length > 0 && (
                <React.Fragment key={category}>
                  <tr>
                    <td
                      colSpan={plans.length + 1}
                      className="bg-gray-100 p-4 font-medium"
                    >
                      {category}
                    </td>
                  </tr>
                  {features.map((feature) => (
                    <tr
                      key={feature}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-4 flex items-center">
                        <span>
                          {feature
                            .replace(/_/g, " ")
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </span>
                        {Object.keys(tooltips).includes(feature) && (
                          <div className="relative ml-2">
                            <HelpCircle
                              className="h-4 w-4 text-gray-400 cursor-help"
                              onMouseEnter={() => setShowTooltip(feature)}
                              onMouseLeave={() => setShowTooltip(null)}
                            />
                            {showTooltip === feature && (
                              <div className="absolute left-6 top-0 w-48 bg-gray-800 text-white text-xs rounded py-2 px-3 z-10">
                                {tooltips[feature as keyof typeof tooltips]}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      {plans.map((plan) => (
                        <td
                          key={`${plan._id}-${feature}`}
                          className="p-4 text-center"
                        >
                          {plan.features && feature in plan.features ? (
                            typeof plan.features[feature] === "boolean" ? (
                              plan.features[feature] === true ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-400 mx-auto" />
                              )
                            ) : (
                              <span className="font-medium">
                                {plan.features[feature] == -1
                                  ? "Unlimited"
                                  : plan.features[feature]}
                              </span>
                            )
                          ) : (
                            <X className="h-5 w-5 text-red-400 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
