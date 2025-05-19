import React, { useState } from "react";
import { BarChart, LineChart } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardGraphProps {
  timeframe: "weekly" | "monthly";
  trends: Array<{ label: string; value: number }>;
  applicantsData: Array<{ title: string; applicants: number }>;
  loading: boolean;
  error: string | null;
  onTimeframeChange: (timeframe: "weekly" | "monthly") => void;
}

const DashboardGraph: React.FC<DashboardGraphProps> = ({
  timeframe,
  trends,
  applicantsData,
  loading,
  error,
  onTimeframeChange,
}) => {
  const [graphType, setGraphType] = useState<"applicants" | "trends">(
    "applicants"
  );
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };
  const applicantsChartData = {
    labels: applicantsData.map((job) => truncateText(job.title, 20)),
    datasets: [
      {
        label: "Applicants",
        data: applicantsData.map((job) => job.applicants),
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
    ],
  };

  const trendsChartData = {
    labels: trends.map((t) => t.label),
    datasets: [
      {
        label: "Job Postings",
        data: trends.map((t) => t.value),
        borderColor: "rgba(79, 70, 229, 1)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
        <div className="h-[400px] bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Dashboard Analytics
        </h2>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            {graphType === "applicants" ? (
              <BarChart className="h-5 w-5 text-indigo-500 mr-2" />
            ) : (
              <LineChart className="h-5 w-5 text-indigo-500 mr-2" />
            )}
            <h2 className="text-lg font-medium text-gray-900">
              {graphType === "applicants"
                ? "Applicants per Job"
                : "Job Posting Trends"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setGraphType("applicants")}
                className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  graphType === "applicants"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <BarChart className="h-4 w-4 mr-1.5" />
                Applicants
              </button>
              <button
                onClick={() => setGraphType("trends")}
                className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  graphType === "trends"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <LineChart className="h-4 w-4 mr-1.5" />
                Trends
              </button>
            </div>

            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => onTimeframeChange("weekly")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeframe === "weekly"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => onTimeframeChange("monthly")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeframe === "monthly"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          {graphType === "applicants" ? (
            applicantsData.length > 0 ? (
              <Bar data={applicantsChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No applicant data available</p>
              </div>
            )
          ) : trends.length > 0 ? (
            <Line data={trendsChartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No trend data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardGraph;
