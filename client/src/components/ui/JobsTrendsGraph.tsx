import React from "react";
import { LineChart, PieChart } from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface JobTrendsGraphProps {
  timeframe: "weekly" | "monthly";
  onTimeframeChange: (timeframe: "weekly" | "monthly") => void;
}

const JobTrendsGraph: React.FC<JobTrendsGraphProps> = ({
  timeframe,
  onTimeframeChange,
}) => {
  const { loading, error, data } = useDashboardData();

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
        <div className="h-60 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Job Posting Trends
        </h2>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">
            Error loading trend data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Get chart data based on timeframe
  const chartData =
    timeframe === "weekly" ? data?.weeklyTrends : data?.monthlyTrends;

  const lineChartData = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: "Job Postings",
        data: chartData?.values || [],
        borderColor: "rgba(79, 70, 229, 1)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(79, 70, 229, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <LineChart className="h-5 w-5 text-indigo-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Job Posting Trends
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                timeframe === "weekly"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onTimeframeChange("weekly")}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                timeframe === "monthly"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => onTimeframeChange("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-64">
          {chartData?.labels.length ? (
            <Line data={lineChartData} options={chartOptions} />
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

export default JobTrendsGraph;
