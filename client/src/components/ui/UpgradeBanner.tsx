import React from "react";
import { TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
// import Link from "next/link";

interface UpgradeBannerProps {
  currentPlan: string;
  price: number;
}

const UpgradeBanner: React.FC<UpgradeBannerProps> = ({
  currentPlan,
  price,
}) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
      <div className="max-w-7xl mx-auto flex items-center">
        <TriangleAlert className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
        <p className="text-yellow-700 mr-4">
          You're currently on the {currentPlan} plan (${price}/month). Upgrade
          for more features and capabilities.
        </p>
        <Link
          to="/subscriptions"
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  );
};

export default UpgradeBanner;
