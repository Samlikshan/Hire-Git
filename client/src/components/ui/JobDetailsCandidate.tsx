import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Share2,
  Bookmark,
  Heart,
  ChevronDown,
  ChevronUp,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CandidateJob } from "@/types/job";
import {
  applyJobService,
  getJobDetailsService,
  isAppliedJobService,
} from "@/services/job";
import { formatDate } from "@/lib/utils";
import { JobApplicationForm } from "../forms/JobApplicationForm";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";

export default function JobDetailsCandidate() {
  const user = useSelector((state: RootState) => state.user.userData);
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<CandidateJob>();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [openApplyModal, setOpenApplyModal] = useState(false);
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
    const isApplied = async () => {
      if (!jobId || !user?._id) {
        return;
      }
      try {
        const response = await isAppliedJobService(jobId, user?._id);
        if (response.status == 200) {
          setIsApplied(response.data.isApplied);
        }
      } catch (error) {
        console.error("Error checking is applied for job:", error);
      }
    };

    getJobDetails();
    isApplied();
  }, [jobId, user]);

  if (!job) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
        </motion.div>
      </div>
    );
  }

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

  const handleShareClick = () => {
    setShowShareTooltip(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => {
      setShowShareTooltip(false);
    }, 2000);
  };

  const handleJobSubmit = async (formData: FormData) => {
    try {
      const response = await applyJobService(formData, jobId!);
      if (response.status == 200) {
        toast.success("Applied job seccesfully");
        setOpenApplyModal(false);
        setIsApplied(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const SimilarJobCard = ({ similarJob }: { similarJob: typeof job }) => (
  //   <motion.div
  //     initial={{ opacity: 0, y: 10 }}
  //     animate={{ opacity: 1, y: 0 }}
  //     className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all"
  //   >
  //     <div className="flex items-center gap-3 mb-3">
  //       <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
  //         {/* <Building2 className="w-5 h-5 text-gray-600" /> */}
  //         <img
  //           className="h-full w-full rounded-lg"
  //           src={`${import.meta.env.VITE_S3_PATH}/${similarJob.company.logo}`}
  //           alt=""
  //         />
  //       </div>
  //       <div>
  //         <h3 className="font-medium text-gray-900">
  //           {similarJob.company.name}
  //         </h3>
  //         <div className="flex items-center gap-1 text-sm text-gray-500">
  //           <MapPin className="w-3 h-3" />
  //           {similarJob.location}
  //         </div>
  //       </div>
  //     </div>

  //     <Link to={`/jobs/${similarJob._id}`} className="block">
  //       <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
  //         {similarJob.title}
  //       </h4>
  //     </Link>

  //     <div className="flex flex-wrap gap-2 mb-3">
  //       <Badge className={getJobTypeColor(similarJob.type)}>
  //         {similarJob.type}
  //       </Badge>
  //       <Badge variant="outline" className="flex items-center gap-1">
  //         <DollarSign className="w-3 h-3" />
  //         {similarJob.salary}
  //       </Badge>
  //     </div>

  //     <div className="flex flex-wrap gap-1 mb-3">
  //       {similarJob.tags?.slice(0, 3).map((tag, i) => (
  //         <Badge key={i} variant="secondary" className="text-xs">
  //           {tag}
  //         </Badge>
  //       ))}
  //       {(similarJob.tags?.length || 0) > 3 && (
  //         <span className="text-xs text-gray-500">
  //           +{(similarJob.tags?.length || 0) - 3} more
  //         </span>
  //       )}
  //     </div>

  //     <div className="flex items-center justify-between text-sm text-gray-500">
  //       <div className="flex items-center gap-1">
  //         <Calendar className="w-4 h-4" />
  //         {getTimeAgo(similarJob.createdAt)}
  //       </div>
  //       <Link to={`/jobs/${similarJob._id}`}>
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="text-blue-600 hover:text-blue-700"
  //         >
  //           View Details →
  //         </Button>
  //       </Link>
  //     </div>
  //   </motion.div>
  // );

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/jobs"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Similar Jobs - Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Similar Jobs</h2>
              {/* <div className="space-y-4">
                {relatedJobs
                  .filter((j) => j._id !== jobId)
                  .slice(0, 5)
                  .map((similarJob) => (
                    <SimilarJobCard
                      key={similarJob._id}
                      similarJob={similarJob}
                    />
                  ))}
              </div> */}
            </div>
          </motion.div>
          <JobApplicationForm
            jobTitle={job.title}
            company={job.company.name}
            companyLogo={job.company.logo}
            isOpen={openApplyModal}
            onSubmit={handleJobSubmit}
            onClose={() => setOpenApplyModal(false)}
          />
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Job Header */}
            <motion.div
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {job.company.logo ? (
                      <img
                        className="h-full w-full rounded-lg"
                        src={`${import.meta.env.VITE_S3_PATH}/${
                          job.company.logo
                        }`}
                        alt={job.company.name}
                      />
                    ) : (
                      <Building2 className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">{job.company.name}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="relative"
                    onClick={handleShareClick}
                  >
                    <Share2 size={18} />
                    <AnimatePresence>
                      {showShareTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap"
                        >
                          Copied to clipboard!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className={
                      isSaved ? "text-blue-600 border-blue-200 bg-blue-50" : ""
                    }
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Bookmark
                      size={18}
                      className={isSaved ? "fill-blue-600" : ""}
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className={
                      isLiked ? "text-red-600 border-red-200 bg-red-50" : ""
                    }
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      size={18}
                      className={isLiked ? "fill-red-600" : ""}
                    />
                  </Button>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 "
                    disabled={isApplied}
                    onClick={() => setOpenApplyModal(true)}
                  >
                    {isApplied ? "Applied" : "Apply Now"}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className={getJobTypeColor(job.type)}>{job.type}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {job.experienceLevel}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {job.salary}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {job.applicants} applicants
                </Badge>
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
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
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
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
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
            </motion.div>

            {/* Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">
                Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>{resp}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <div className="mt-1 min-w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                      {index + 1}
                    </div>
                    <span>{req}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Required Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Badge variant="secondary" className="text-sm py-1.5 px-3">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold mb-4">
                  Additional Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Badge variant="outline" className="text-sm py-1 px-3">
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
