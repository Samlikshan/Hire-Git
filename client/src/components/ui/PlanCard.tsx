import React from "react";
import { Check, Star } from "lucide-react";
import { Plan } from "@/types/Plan";
import { handlePayment } from "@/services/subscription";

interface PlanCardProps {
  plan: Plan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <div
      className={`
        relative rounded-xl overflow-hidden 
        ${
          plan.isPopular
            ? "border-2 border-blue-500 shadow-xl scale-105 z-10"
            : "border border-gray-200 shadow-md"
        } 
        bg-white transition-all duration-300 hover:shadow-xl flex flex-col
      `}
    >
      {plan.isPopular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white py-1 px-4 rounded-bl-lg font-medium flex items-center">
          <Star className="h-4 w-4 mr-1" fill="white" /> Popular
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {plan.name}
        </h3>
        <p className="text-gray-600 mb-6">{plan.description}</p>

        <div className="mt-auto">
          <p className="mb-1">
            <span className="text-4xl font-bold text-gray-900">
              ${plan.monthlyPrice}
            </span>
            <span className="text-gray-600 font-medium"> / month</span>
          </p>
          {/* {plan.discountedFromPrice && (
            <p className="text-sm text-gray-500 mb-4">
              <span className="line-through">${plan.discountedFromPrice}</span>
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                Save ${plan.discountedFromPrice - plan.price}
              </span>
            </p>
          )} */}
        </div>

        <ul className="my-6 space-y-3">
          {/* {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))} */}
          {Object.entries(plan.features).map(([key, value], index) => (
            <li key={index} className="flex items-start text-sm">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-600">
                {key[0].toUpperCase() + key.slice(1)}:{" "}
                <strong>{value == -1 ? "Unlimited" : value}</strong>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 pt-0">
        <button
          onClick={() => handlePayment(plan.stripePriceId)}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 
            ${
              plan.isPopular
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900"
            }
          `}
        >
          {plan.isPopular ? "Get Started Now" : "Choose Plan"}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
