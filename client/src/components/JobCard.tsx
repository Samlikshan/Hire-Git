import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Users } from "lucide-react";
import { Job } from "../types/job";
import { Link } from "react-router-dom";
import { formatDate, getTimeAgo } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-blue-100 text-blue-800";
      case "Part-time":
        return "bg-green-100 text-green-800";
      case "Contract":
        return "bg-purple-100 text-purple-800";
      case "Internship":
        return "bg-orange-100 text-orange-800";
      case "Freelance":
        return "bg-teal-100 text-teal-800";
      case "Seasonal":
        return "bg-pink-100 text-pink-800";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all border border-gray-100"
    >
      {/* Job Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Active Until: {formatDate(job.deadline)}</span>
          </div>
          <div className="text-xs text-gray-500">
            Posted {getTimeAgo(job.createdAt)}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {job.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getDepartmentColor(job.department)}>
            {job.department}
          </Badge>
          <Badge className={getJobTypeColor(job.type)}>{job.type}</Badge>
          <Badge className={getLocationColor(job.location)}>
            {job.location}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          <span>{job.applicants || 0} Applicants</span>
        </div>
      </div>

      {/* Job Card Footer */}
      <div className="p-3 bg-gray-50 flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Link to={`/company/job/${job._id}`}>
            <Button variant="outline" size="sm" className="text-blue-600">
              View
            </Button>
          </Link>
        </div>

        {job.status === "active" && (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Active
          </Badge>
        )}
        {job.status === "draft" && (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Draft
          </Badge>
        )}
        {job.status === "closed" && (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Closed
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
