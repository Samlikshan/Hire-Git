import React from "react";
import { CheckCircle, AlertCircle, Star } from "lucide-react";
import { Plan } from "@/types/Plan";

// interface PlanProps {
//   plan: {
//     name: string;
//     isActive: boolean;
//     price: number;
//     billingCycle: string;
//     features: string[];
//   };
// }

const PlanCard: React.FC<{ plan: Plan | undefined }> = ({ plan }) => {
  if (!plan) {
    return;
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover-lift">
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {plan?.name}
            </h2>
            <div className="flex items-center mt-2">
              {plan?.isActive ? (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle
                    size={16}
                    className="mr-1.5 animate-pulse-blue"
                  />
                  <span className="text-sm font-medium">Active Plan</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <AlertCircle size={16} className="mr-1.5" />
                  <span className="text-sm font-medium">Inactive</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-900">
                ${plan?.monthlyPrice}
              </span>
              <span className="ml-1 text-gray-500 text-sm">/monthly</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-medium text-gray-900 flex items-center mb-4">
            <Star size={18} className="mr-2 text-yellow-500" />
            Plan Features
          </h3>
          <ul className="space-y-3">
            {/* {plan.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-6 mr-3 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-blue-600" />
                </div>
                {feature}
              </li>
            ))} */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
