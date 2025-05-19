import React, { useState } from "react";
import { BarChart, Info } from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ApplicantsChart: React.FC = () => {
  const { loading, error, data } = useDashboardData();
  const [chartViewMode, setChartViewMode] = useState<"all" | "active">(
    "active"
  );

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
          Applicants per Job
        </h2>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">
            Error loading applicant data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Filter jobs based on view mode (all or active only)
  const filteredJobs = data?.jobs
    ? chartViewMode === "active"
      ? data.jobs.filter((job) => job.status === "active").slice(0, 5)
      : data.jobs.slice(0, 5)
    : [];

  // Prepare data for chart
  const chartData = {
    labels: filteredJobs.map((job) => {
      // Truncate long job titles
      const title = job.title;
      return title.length > 20 ? `${title.substring(0, 20)}...` : title;
    }),
    datasets: [
      {
        label: "Applicants",
        data: filteredJobs.map((job) => job.applicants),
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
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
        callbacks: {
          title: function (tooltipItems: TooltipItem<"bar">[]) {
            // Get the job title from the filtered jobs array
            const jobIndex = tooltipItems[0].dataIndex;
            return filteredJobs[jobIndex]?.title || "";
          },
        },
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
            <BarChart className="h-5 w-5 text-indigo-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Applicants per Job
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                chartViewMode === "active"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setChartViewMode("active")}
            >
              Active Jobs
            </button>
            <button
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                chartViewMode === "all"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setChartViewMode("all")}
            >
              All Jobs
            </button>
            <button
              className="text-gray-400 hover:text-gray-600"
              title="Chart shows applicant counts for each job posting"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="h-64">
          {filteredJobs.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No job data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsChart;
