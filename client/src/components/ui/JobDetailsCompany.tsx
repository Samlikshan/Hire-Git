import React, { useState } from "react";
import {
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  Edit,
  Trash2,
  Share2,
  Eye,
  ChevronDown,
  ChevronUp,
  BarChart2,
  FileText,
  Tags,
  AlertTriangle,
  X,
} from "lucide-react";
import JobEditForm from "./JobEditForm";
import { Job } from "@/types/job";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { deleteJobPostService, updateJobService } from "@/services/job";
import { useNavigate, useParams } from "react-router-dom";
interface JobDetailsCompanyProps {
  job: Job;
}

const JobDetailsCompany: React.FC<JobDetailsCompanyProps> = ({
  job: initialJob,
}) => {
  const { jobId } = useParams();
  const [job, setJob] = useState(initialJob);
  const [isEditing, setIsEditing] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const navigate = useNavigate();

  const handleUpdateJob = async (updatedJob: Job) => {
    try {
      const response = await updateJobService({
        ...updatedJob,
        _id: jobId,
      });
      if (response.status == 200) {
        toast.success(response.data.message);
        setJob(updatedJob);
        setIsEditing(false);
      } else {
        toast.error(response?.data?.error || "Error updating Job");
      }
    } catch (error) {
      console.log("Error updatting job", error);
    }
  };

  if (isEditing) {
    return (
      <JobEditForm
        job={job}
        onSave={(updatedJob) => {
          handleUpdateJob(updatedJob);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
      case "Fulltime":
        return "bg-blue-100 text-blue-800";
      case "Part-time":
        return "bg-green-100 text-green-800";
      case "Contract":
        return "bg-purple-100 text-purple-800";
      case "Internship":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLocationColor = (location: string) => {
    if (location.includes("Remote")) {
      return "bg-indigo-100 text-indigo-800";
    } else if (location.includes("On-Site") || location.includes("On-site")) {
      return "bg-amber-100 text-amber-800";
    } else if (location.includes("In-Office")) {
      return "bg-rose-100 text-rose-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Engineering":
        return "bg-blue-100 text-blue-800";
      case "Design":
        return "bg-purple-100 text-purple-800";
      case "Data":
        return "bg-green-100 text-green-800";
      case "Infrastructure":
        return "bg-orange-100 text-orange-800";
      case "Marketing":
        return "bg-pink-100 text-pink-800";
      case "Hardware":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleShareClick = () => {
    setShowShareTooltip(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => {
      setShowShareTooltip(false);
    }, 2000);
  };
  const handleDelete = async () => {
    try {
      const response = await deleteJobPostService(jobId!);
      if (response.status == 200) {
        setShowDeleteConfirmation(false);
        navigate(-1);
        toast.success("Job deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-6xl mx-auto">
      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <span
                className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${
                  job.status === "active"
                    ? "bg-green-100 text-green-800"
                    : job.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentColor(
                  job.department
                )}`}
              >
                {job.department}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(
                  job.type
                )}`}
              >
                {job.type}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getLocationColor(
                  job.location
                )}`}
              >
                {job.location}
              </span>
            </div>
            {job.tags && job.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Tags size={14} className="text-gray-500" />
                <div className="flex flex-wrap gap-1">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
            {/* <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Eye size={16} className="mr-2" />
              Preview
            </button> */}
            <button
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors relative"
              onClick={handleShareClick}
            >
              <Share2 size={16} className="mr-2" />
              Share
              {showShareTooltip && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  Copied to clipboard!
                </div>
              )}
            </button>
            <button
              className="flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{job.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium">{job.salary}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium">{job.experienceLevel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="font-medium">{formatDate(job.deadline)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="mt-6 bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Job Description</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <Edit size={14} className="mr-1" />
              Edit
            </button>
          </div>
          <div className="relative">
            <p
              className={`text-gray-700 whitespace-pre-line ${
                !isDescriptionExpanded ? "line-clamp-4" : ""
              }`}
            >
              {job.description}
            </p>
            {job.description.length > 200 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-2 text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium transition-colors"
              >
                {isDescriptionExpanded ? (
                  <>
                    Show less <ChevronUp size={16} className="ml-1" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown size={16} className="ml-1" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Responsibilities</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <Edit size={14} className="mr-1" />
              Edit
            </button>
          </div>
          <ul className="list-none space-y-3">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <div className="mt-1 min-w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                  {index + 1}
                </div>
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Requirements</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <Edit size={14} className="mr-1" />
              Edit
            </button>
          </div>
          <ul className="list-none space-y-3">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <div className="mt-1 min-w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                  {index + 1}
                </div>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Required Skills</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <Edit size={14} className="mr-1" />
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Job Stats */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Job Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-800">Total Views</h3>
              <Eye size={16} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">1,245</p>
            <p className="text-xs text-blue-700">+12% from last week</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-800">
                Applications
              </h3>
              <FileText size={16} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">
              {job.applicants}
            </p>
            <p className="text-xs text-green-700">+5% from last week</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-purple-800">
                Conversion Rate
              </h3>
              <BarChart2 size={16} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">1.9%</p>
            <p className="text-xs text-purple-700">-0.3% from last week</p>
          </div>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 backdrop-blur-[1px] bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Job Posting
                </h3>
              </div>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete this job posting? This action
                cannot be undone and will remove all associated data including
                applications and interviews.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsCompany;
