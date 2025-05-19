import React from "react";
import { Briefcase, Calendar, Users, CheckCircle } from "lucide-react";
import StatCard from "../ui/StatCard";

interface StatisticsCardsProps {
  data: {
    totalJobs: number;
    currentMonthJobs: number;
    totalApplicants: number;
    activeJobs: number;
  };
  loading: boolean;
  error: Error;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  data,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
          >
            <div className="h-8 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="h-10 w-20 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading dashboard data
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      id: 1,
      name: "Total Jobs Posted",
      value: data?.totalJobs || 0,
      icon: Briefcase,
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-50",
      change: "+12.5%",
      changeType: "increase",
    },
    {
      id: 2,
      name: "Jobs Posted This Month",
      value: data?.currentMonthJobs || 0,
      icon: Calendar,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
      change: "+8.2%",
      changeType: "increase",
    },
    {
      id: 3,
      name: "Total Applicants",
      value: data?.totalApplicants || 0,
      icon: Users,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      change: "+22.5%",
      changeType: "increase",
    },
    {
      id: 4,
      name: "Active Jobs",
      value: data?.activeJobs || 0,
      icon: CheckCircle,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
      change: "-3.4%",
      changeType: "decrease",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.name}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
          bgColor={stat.bgColor}
          change={stat.change}
          changeType={stat.changeType}
        />
      ))}
    </div>
  );
};

export default StatisticsCards;
