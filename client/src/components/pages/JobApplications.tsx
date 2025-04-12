import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  GraduationCap,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  Search,
  ArrowLeft,
  //   ExternalLink,
  Download,
  Grid,
  List,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { getAppliedJobsService } from "@/services/job";

interface JobApplication {
  _id: string;
  candidate: string;
  job: {
    _id: string;
    title: string;
    type: string;
    location: string;
    department: string;
    description: string;
    salary: string;
    requirements: string[];
    requiredSkills: string[];
    responsibilities: string[];
    experienceLevel: string;
    company: {
      _id: string;
      name: string;
      logo: string;
      headquarters: string;
      emaill: string;
    };
  };
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  coverLetter: string;
  resume: string;
  education: string;
  experience: string;
  status: "applied" | "shortlisted" | "in-progress" | "hired" | "rejected";
  expectedSalary: string;
  createdAt: string;
  updatedAt: string;
}

const StatusBadge: React.FC<{ status: JobApplication["status"] }> = ({
  status,
}) => {
  const statusConfig = {
    applied: { color: "bg-gray-100 text-gray-700", icon: Clock },
    shortlisted: { color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
    "in-progress": { color: "bg-yellow-100 text-yellow-700", icon: Clock },
    hired: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    rejected: { color: "bg-red-100 text-red-700", icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${config.color}`}
    >
      <Icon size={14} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const JobApplications: React.FC = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    JobApplication["status"] | "all"
  >("all");
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  const filteredApplications = jobApplications.filter((app) => {
    const matchesSearch =
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  useEffect(() => {
    const fetchApplications = async () => {
      if (!userData?._id) return;
      try {
        const response = await getAppliedJobsService(userData._id);
        setJobApplications(response.data.appliedJobs);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [userData]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //   const formatDateTime = (dateString: string) => {
  //     return new Date(dateString).toLocaleString("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //   };

  const ApplicationCard = ({
    application,
  }: {
    application: JobApplication;
  }) => (
    <motion.div
      onClick={() => {
        setSelectedApplication(application);
        setShowMobileDetail(true);
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={`${import.meta.env.VITE_S3_PATH}/${
              application.job.company.logo
            }`}
            alt={application.job.company.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {application.job.title}
            </h3>
            <p className="text-sm text-gray-500">
              {application.job.company.name}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400" />
            <span>{application.job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" />
            <span>Applied {formatDate(application.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign size={16} className="text-gray-400" />
            <span>{application.expectedSalary}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={application.status} />

          {/* {application.nextInterview && (
            <span className="text-blue-600 bg-blue-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium">
              Interview scheduled
            </span>
          )} */}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Job Applications
            </h1>
            <p className="text-gray-500 mt-1">
              Track and manage your job applications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {(
                [
                  "all",
                  "applied",
                  "shortlisted",
                  "in-progress",
                  "hired",
                  "rejected",
                ] as const
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status === "all"
                    ? "All"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredApplications.map((application) => (
            <ApplicationCard key={application._id} application={application} />
          ))}
        </div>

        {/* Application Details Modal */}
        <AnimatePresence>
          {selectedApplication && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Application Details
                  </h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={`${import.meta.env.VITE_S3_PATH}/${
                        selectedApplication.job.company.logo
                      }`}
                      alt={selectedApplication.job.company.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {selectedApplication.job.title}
                      </h3>
                      <p className="text-gray-500">
                        {selectedApplication.job.company.name}
                      </p>
                    </div>
                    <StatusBadge status={selectedApplication.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={18} className="text-gray-400" />
                      <span>{selectedApplication.job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} className="text-gray-400" />
                      <span>
                        Applied {formatDate(selectedApplication.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={18} className="text-gray-400" />
                      <span>{selectedApplication.expectedSalary}</span>
                    </div>
                  </div>

                  {/* {selectedApplication.nextInterview && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Next Interview
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-700">
                            {selectedApplication.nextInterview.type}
                          </p>
                          <p className="text-blue-600 text-sm mt-1">
                            {formatDateTime(
                              selectedApplication.nextInterview.date
                            )}
                          </p>
                        </div>
                        {selectedApplication.nextInterview.link && (
                          <a
                            href={selectedApplication.nextInterview.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                          >
                            <ExternalLink size={16} />
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                  )} */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Personal Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building size={18} className="text-gray-400" />
                          <span>{selectedApplication.job.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <GraduationCap size={18} className="text-gray-400" />
                          <span>{selectedApplication.education}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={18} className="text-gray-400" />
                          <span>
                            {selectedApplication.experience} of experience
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={18} className="text-gray-400" />
                          <span>{selectedApplication.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={18} className="text-gray-400" />
                          <span>{selectedApplication.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">Resume</p>
                          <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download size={20} />
                      </button>
                    </div>

                    {selectedApplication.coverLetter && (
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <MessageSquare size={20} className="text-blue-500" />
                          <h4 className="font-medium text-gray-900">
                            Cover Letter
                          </h4>
                        </div>
                        <p className="text-gray-600">
                          {selectedApplication.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* {selectedApplication.feedback && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Feedback
                      </h4>
                      <div
                        className={`p-4 rounded-lg ${
                          selectedApplication.status === "rejected"
                            ? "bg-red-50 border border-red-100"
                            : "bg-green-50 border border-green-100"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            selectedApplication.status === "rejected"
                              ? "text-red-700"
                              : "text-green-700"
                          }`}
                        >
                          {selectedApplication.feedback}
                        </p>
                      </div>
                    </div>
                  )} */}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
