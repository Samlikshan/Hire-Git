import React from "react";

// Update the icon type to be a React component type (ElementType is more flexible)
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType; // This allows any React component (like icons) to be passed
  iconColor: string;
  bgColor: string;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon, // Rename for clarity
  iconColor,
  bgColor,
  change,
  changeType = "neutral",
}) => {
  // Format value based on magnitude
  const formatValue = (val: number): string => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${bgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} /> {/* Render the icon */}
        </div>
        <div className="ml-5">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {formatValue(value)}
            </p>
            {change && (
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  changeType === "increase"
                    ? "text-green-600"
                    : changeType === "decrease"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {changeType === "increase" ? (
                  <svg
                    className="self-center flex-shrink-0 h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : changeType === "decrease" ? (
                  <svg
                    className="self-center flex-shrink-0 h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : null}
                <span className="sr-only">
                  {changeType === "increase"
                    ? "Increased by"
                    : changeType === "decrease"
                    ? "Decreased by"
                    : "Changed by"}
                </span>
                {change}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
