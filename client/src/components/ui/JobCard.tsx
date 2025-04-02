import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  BookmarkPlus,
} from "lucide-react";
import { CandidateJob } from "@/types/job";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";

interface JobCardProps {
  job: CandidateJob;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all border border-gray-100 flex flex-col h-full"
    >
      <div className="p-4 flex-1">
        {/* Company Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {job.company.logo ? (
              <img
                className="h-full w-full rounded-lg"
                src={`${import.meta.env.VITE_S3_PATH}/${job.company.logo}`}
                alt={job.company.name}
              />
            ) : (
              <Building2 className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{job?.company?.name}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-3 h-3" />
              {job.location}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>

        {/* Job Info */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {job.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getJobTypeColor(job.type)}>{job.type}</Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {job.experienceLevel}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {job.salary}
          </Badge>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {job.requiredSkills &&
            job.requiredSkills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            Posted {formatDate(job.createdAt)}
          </div>
          <Link to={`/jobs/${job._id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
