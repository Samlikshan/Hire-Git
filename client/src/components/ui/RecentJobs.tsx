import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { formatDate } from "../../lib/dateUtil";

interface Job {
  id: string;
  title: string;
  status: string;
  postedDate: string;
  applicants: number;
  department?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
}

interface RecentJobsProps {
  jobs: Job[];
  pagination?: Pagination;
  loading: boolean;
  error: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onStatusChange: (status: "all" | "active") => void;
  onSearch: (query: string) => void;
  onSortChange: (key: string, direction: "asc" | "desc") => void;
}

const jobStatuses = [
  { value: "all", label: "All", color: "bg-gray-100 text-gray-800" },
  { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
  { value: "paused", label: "Paused", color: "bg-yellow-100 text-yellow-800" },
  { value: "closed", label: "Closed", color: "bg-red-100 text-red-800" },
];

const RecentJobPosts: React.FC<RecentJobsProps> = ({
  jobs,
  pagination,
  loading,
  error,
  currentPage,
  onPageChange,
  onStatusChange,
  onSearch,
  onSortChange,
}) => {
  const [localSearch, setLocalSearch] = useState("");
  const [localStatus, setLocalStatus] = useState<"all" | "active">("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "postedDate",
    direction: "desc",
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => onSearch(localSearch), 500);
    return () => clearTimeout(handler);
  }, [localSearch]);

  const handleSort = (key: string) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    onSortChange(key, direction);
  };

  const handleStatusChange = (status: "all" | "active") => {
    setLocalStatus(status);
    onStatusChange(status);
  };

  const getStatusBadge = (status: string) => {
    const statusObj = jobStatuses.find((s) => s.value === status);
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusObj?.color}`}
      >
        {statusObj?.label || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-10 w-1/3 bg-gray-200 rounded"></div>
              <div className="h-10 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Job Posts
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
        <h2 className="text-lg font-medium text-gray-900">Recent Job Posts</h2>
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="relative rounded-md w-full sm:w-64 mb-4 sm:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search jobs..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <div className="inline-block relative w-full sm:w-auto">
              <select
                className="bg-white border border-gray-300 rounded-md py-2 px-3 flex items-center justify-between text-sm w-full sm:w-40"
                value={localStatus}
                onChange={(e) =>
                  handleStatusChange(e.target.value as "all" | "active")
                }
              >
                {jobStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("postedDate")}
              >
                <div className="flex items-center">
                  Posted Date
                  {sortConfig.key === "postedDate" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("applicants")}
              >
                <div className="flex items-center">
                  Applicants
                  {sortConfig.key === "applicants" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {job.title}
                    </div>
                    {job.department && (
                      <div className="text-sm text-gray-500">
                        {job.department}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(job.postedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.applicants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page{" "}
                <span className="font-medium">{pagination.currentPage}</span> of{" "}
                <span className="font-medium">{pagination.totalPages}</span>
              </p>
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                {currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  currentPage === pagination.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentJobPosts;
