import React from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { formatDate, getDayDifference } from "@/lib/utils";

const SubscriptionStatus: React.FC<{
  startedDate: Date | undefined;
  nextBillingDate: Date | undefined;
}> = ({ startedDate, nextBillingDate }) => {
  if (!startedDate || !nextBillingDate) {
    return;
  }
  const getDaysLeftColor = (days: number) => {
    if (days <= 5) return "bg-red-50 text-red-800";
    if (days <= 10) return "bg-amber-50 text-amber-800";
    return "bg-blue-50 text-blue-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover-lift">
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar size={20} className="mr-2 text-blue-600" />
          Subscription Timeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`flex items-center p-5 rounded-xl ${getDaysLeftColor(
              getDayDifference(nextBillingDate)
            )}`}
          >
            <div className="mr-4 bg-white bg-opacity-30 rounded-full p-3">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Time Remaining</p>
              <div className="flex items-baseline mt-1">
                <span className="text-3xl font-bold">
                  {getDayDifference(nextBillingDate)}
                </span>
                <span className="ml-1.5 text-sm opacity-75">days left</span>
              </div>
            </div>
          </div>

          <div className="flex items-center p-5 bg-purple-50 rounded-xl">
            <div className="mr-4 bg-purple-100 rounded-full p-3">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900">
                Next Payment
              </p>
              <p className="text-lg font-semibold text-purple-900 mt-1">
                {formatDate(nextBillingDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative pt-4">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-progress"
                style={
                  {
                    "--progress-width": `${Math.min(
                      100 - (getDayDifference(nextBillingDate) / 30) * 100,
                      100
                    )}%`,
                  } as React.CSSProperties
                }
              ></div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="ml-2 text-gray-600">
                    {formatDate(startedDate)}
                  </span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="ml-2 text-gray-600">
                    {formatDate(nextBillingDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {getDayDifference(nextBillingDate) <= 5 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center animate-fadeIn">
              <AlertCircle size={20} className="text-red-600 mr-2" />
              <p className="text-sm text-red-800">
                Your subscription is ending soon. Renew now to avoid service
                interruption.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
