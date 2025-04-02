import { getJobDetailsService } from "@/services/job";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobDescription from "../ui/JobDetailsCompany";
import { Job } from "@/types/job";

function JobDetailsCompany() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("description");
  const [job, setJob] = useState<Job>();

  const { jobId } = useParams();

  useEffect(() => {
    const getJobDetails = async () => {
      if (!jobId) {
        return;
      }
      try {
        const response = await getJobDetailsService(jobId);
        setJob(response.data.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    getJobDetails();
  }, [jobId]);

  if (!job) {
    return <h1>...Loading</h1>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex items-center">
          <button
            className="flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="mr-1" />
            <span className="text-sm">Back to Job List</span>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 ml-6">
            {job?.title}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex mt-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "description"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("description")}
          >
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Job Description
            </span>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "candidates"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("candidates")}
          >
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Candidates
            </span>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "interviews"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("interviews")}
          >
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Interviews
            </span>
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "progress"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("progress")}
          >
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              In-Progress
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === "description" && <JobDescription job={job} />}
      </main>
    </div>
  );
}
export default JobDetailsCompany;
