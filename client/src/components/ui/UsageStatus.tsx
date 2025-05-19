import React from "react";
import { FileText, BarChart2, TrendingUp } from "lucide-react";
import { getPercentage } from "@/lib/utils";

const UsageStats: React.FC<{
  jobsPosted: number | undefined;
  jobsAllowed: number | undefined;
}> = ({ jobsPosted, jobsAllowed }) => {
  if (jobsPosted == undefined || jobsAllowed == undefined) {
    return;
  }

  const getUsageColor = (percent: number) => {
    if (percent >= 90) return "from-red-400 to-red-500";
    if (percent >= 75) return "from-amber-400 to-amber-500";
    return "from-emerald-400 to-teal-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover-lift">
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart2 size={20} className="mr-2 text-emerald-600" />
          Usage Analytics
        </h2>

        <div className="flex items-center mb-6">
          <div className="mr-4 bg-emerald-100 rounded-full p-3">
            <FileText size={24} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Monthly Job Postings
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {jobsPosted} / {jobsAllowed == -1 ? Infinity : jobsAllowed}
              </p>
            </div>

            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getUsageColor(
                  getPercentage(
                    jobsPosted,
                    jobsAllowed == -1 ? Infinity : jobsAllowed
                  )
                )} rounded-full transition-all duration-1000 ease-out animate-progress`}
                style={
                  {
                    "--progress-width": `${getPercentage(
                      jobsPosted,
                      jobsAllowed == -1 ? Infinity : jobsAllowed
                    )}%`,
                  } as React.CSSProperties
                }
              ></div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center text-gray-800">
            <TrendingUp size={18} className="mr-2 text-emerald-600" />
            <p className="text-sm">
              {jobsPosted < (jobsAllowed == -1 ? Infinity : jobsAllowed) ? (
                <>
                  You can post{" "}
                  <span className="font-semibold text-emerald-600">
                    {jobsAllowed == -1
                      ? "unlimited"
                      : jobsAllowed - jobsPosted + " " + "more"}
                  </span>{" "}
                  jobs this month
                </>
              ) : (
                <span className="text-red-600 font-medium">
                  Monthly limit reached
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Monthly Quota</p>
            <p className="text-2xl font-bold text-gray-900">
              {jobsAllowed == -1 ? "Unlimited" : jobsAllowed}
            </p>
            <p className="text-sm text-gray-500 mt-1">available posts</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Current Usage</p>
            <p className="text-2xl font-bold text-gray-900">
              {getPercentage(
                jobsPosted,
                jobsAllowed == -1 ? Infinity : jobsAllowed
              )}
              %
            </p>
            <p className="text-sm text-gray-500 mt-1">quota utilized</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStats;
