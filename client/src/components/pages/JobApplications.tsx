// pages/applied-jobs.tsx
import React, { useState, useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";
import JobApplicationCard from "./JobApplicationCard";
import { Interview } from "@/types/Interview";
import { getAppliedJobsService } from "@/services/job";
import { acceptOfferService, rejectOfferService } from "@/services/interview";

type ViewMode = "grid" | "list";
type FilterStatus =
  | "All"
  | "applied"
  | "shortlisted"
  | "in-progress"
  | "hired"
  | "rejected";

const AppliedJobsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAppliedJobsService("adfasdf");
        console.log(response);
        if (response.data?.jobHistory) {
          setInterviews(response.data.jobHistory);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcceptOffer = async (interviewId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("signedOfferLetter", file); // Fixed typo here
      const response = await acceptOfferService(interviewId, formData);

      if (response.status == 200) {
        setInterviews((prev) =>
          prev.map((int) =>
            int._id === interviewId
              ? {
                  ...int,
                  offerStatus: "accepted",
                  signedOfferLetter: URL.createObjectURL(file),
                  offerAcceptedAt: new Date().toISOString(),
                }
              : int
          )
        );
      }
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept offer. Please try again.");
    }
  };

  const handleDeclineOffer = async (interviewId: string, reason: string) => {
    try {
      const response = rejectOfferService(interviewId, reason);
      if (response.status == 200) {
        setInterviews((prev) =>
          prev.map((int) =>
            int._id === interviewId
              ? {
                  ...int,
                  offerStatus: "rejected",
                  candidateFeedback: reason,
                  offerRejectedAt: new Date().toISOString(),
                }
              : int
          )
        );
      }
    } catch (err) {
      console.error("Decline error:", err);
      alert("Failed to decline offer. Please try again.");
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const matchesStatus =
      filterStatus === "All" || interview.application.status === filterStatus;

    const searchLower = searchQuery.toLowerCase();
    const job = interview.job;
    const company = interview.job.company;

    const matchesSearch =
      job.title?.toLowerCase().includes(searchLower) ||
      job.location?.toLowerCase().includes(searchLower) ||
      company.name?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const getStatusCount = (status: FilterStatus) =>
    status === "All"
      ? interviews.length
      : interviews.filter((int) => int.application.status === status).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-pulse max-w-sm w-full space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-sm text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Application History</h1>
          <p className="text-gray-500 mt-1">
            Track your interviews and application progress
          </p>
        </header>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-1 bg-white p-1 rounded-md border">
            {(
              [
                "All",
                "applied",
                "shortlisted",
                "in-progress",
                "hired",
                "rejected",
              ] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  filterStatus === status
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {status === "in-progress" ? "In Progress" : status}
                {status !== "All" && ` (${getStatusCount(status)})`}
              </button>
            ))}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
            <div className="flex bg-white p-1 rounded-md border">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-400"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-400"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="bg-white p-6 rounded-md text-center">
            <div className="text-gray-400 mb-3">📋</div>
            <h3 className="text-lg font-medium mb-2">No applications found</h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try different search terms"
                : "No applications submitted yet"}
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "md:grid-cols-2 xl:grid-cols-3"
                : "max-w-3xl mx-auto"
            }`}
          >
            {filteredInterviews.map((interview) => (
              <JobApplicationCard
                key={interview._id}
                interview={interview}
                onAcceptOffer={handleAcceptOffer}
                onDeclineOffer={handleDeclineOffer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobsPage;
