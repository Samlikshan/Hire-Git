import React, { useEffect, useState } from "react";
import { Upload, Eye, FileText } from "lucide-react";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  MessageSquare,
  Users,
  Code,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import {
  hireService,
  rejectService,
  inProgressService,
} from "@/services/interview";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface Evaluation {
  completedAt: Date;
  ratings: {
    communication: number;
    technical: number;
    cultureFit: number;
  };
  notes: string;
  recommendation: "hire" | "hold" | "reject";
}
interface Interview {
  _id: string;
  application: {
    _id: string;
    candidate: Candidate;
    job: string;
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
    education: string;
    currentTitle: string;
    experience: string;
    expectedSalary: string;
    resume: string;
    coverLetter: string;
    status: string;
    __v: number;
    updatedAt: string;
  };
  job: string;
  scheduledAt: string;
  duration: string;
  time: string;
  timeZone: string;
  roomId: string;
  meetingLink: string;
  round: string;
  mode: "video" | "in-person";
  status: "scheduled" | "completed" | "cancelled" | "hired" | "rejected";
  note: string;
  offerStatus: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  evaluation: Evaluation;
  signedOfferLetter: string;
  __v: number;
}

interface Candidate {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  resume: string;
}
const InProgress: React.FC = () => {
  const { jobId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "recommended" | "hold" | "not_recommended"
  >("all");

  const [interviews, setInterviews] = useState<Interview[]>([]);

  const [showHireModal, setShowHireModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleHire = async (interviewId: string, offerLetterFile: File) => {
    if (!offerLetterFile) {
      alert("Please select an offer letter PDF");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("offerLetter", offerLetterFile);

    try {
      // Example API call
      const response = await hireService(formData, interviewId);

      if (response.status == 200) {
        toast.success(response.data.message);
      }
      // Handle response
      setShowHireModal(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting hire:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (interviewId: string, reason: string) => {
    if (!reason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setIsLoading(true);

    try {
      const response = await rejectService(interviewId, reason);
      if (response.status === 200) {
        toast.success(response.data.message);
        // Update local state if needed
        setInterviews((prev) =>
          prev.map((int) =>
            int._id === interviewId ? { ...int, status: "rejected" } : int
          )
        );
      }
      setShowRejectModal(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      toast.error("Failed to reject candidate");
    } finally {
      setIsLoading(false);
    }
  };

  const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const filteredInterviews = interviews?.filter((interview) => {
    const matchesSearch =
      interview?.application?.candidate.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      interview.application.candidate.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "recommended")
      return matchesSearch && interview.evaluation?.recommendation === "hire";
    if (filterStatus === "hold")
      return matchesSearch && interview.evaluation?.recommendation === "hold";
    if (filterStatus === "not_recommended")
      return matchesSearch && interview.evaluation?.recommendation === "reject";

    return matchesSearch;
  });
  useEffect(() => {
    if (!jobId) return;
    const fetchInProgress = async () => {
      const response = await inProgressService(jobId);
      console.log(response);
      if (response.status == 200) {
        setInterviews(response.data);
      }
    };
    fetchInProgress();
  }, []);
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Completed Interviews
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Review and evaluate candidate interviews
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 md:flex-none">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                <Filter size={16} className="mr-2" />
                Filter
                <ChevronDown size={16} className="ml-2" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                <div className="py-1">
                  {["all", "recommended", "hold", "not_recommended"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setFilterStatus(
                            status as
                              | "all"
                              | "recommended"
                              | "hold"
                              | "not_recommended"
                          )
                        }
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filterStatus === status
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).replace("_", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredInterviews.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No completed interviews found
            </div>
          )}
          {filteredInterviews.map((interview) => (
            <div
              key={interview._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <img
                    src={`${import.meta.env.VITE_S3_PATH}/${
                      interview?.application?.candidate?.profileImage
                    }`}
                    alt={interview?.application?.candidate?.name}
                    className="w-16 h-16 rounded-full mr-4 border-2 border-blue-100"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {interview?.application?.candidate?.name}
                    </h3>
                    <p className="text-gray-600">
                      {interview?.application?.candidate?.email}
                    </p>
                  </div>
                </div>

                {/* Updated Status/Action Buttons */}
                <div className="flex items-center gap-3">
                  {interview.status === "hired" ? (
                    <>
                      {interview.offerStatus === "pending" && (
                        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center">
                          <CheckCircle2
                            size={18}
                            className="mr-2 text-green-600"
                          />
                          Pending Candidate Response
                        </div>
                      )}
                      {interview.offerStatus === "accepted" && (
                        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md flex items-center">
                          <CheckCircle2
                            size={18}
                            className="mr-2 text-blue-600"
                          />
                          Offer Accepted
                        </div>
                      )}
                      {interview.signedOfferLetter && (
                        <a
                          href={`${import.meta.env.VITE_S3_PATH}/${
                            interview.signedOfferLetter
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:underline flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Signed Offer
                        </a>
                      )}
                      {interview.offerStatus === "rejected" && (
                        <div className="px-4 py-2 bg-red-100 text-red-800 rounded-md flex items-center">
                          <XCircle size={18} className="mr-2 text-red-600" />
                          Offer Declined
                        </div>
                      )}
                    </>
                  ) : interview.status === "rejected" ? (
                    <div className="px-4 py-2 bg-red-100 text-red-800 rounded-md flex items-center">
                      <XCircle size={18} className="mr-2 text-red-600" />
                      Candidate Rejected
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowHireModal(interview._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center shadow-sm"
                      >
                        <CheckCircle2 size={18} className="mr-2" />
                        Hire
                      </button>
                      <button
                        onClick={() => setShowRejectModal(interview._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center shadow-sm"
                      >
                        <XCircle size={18} className="mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2 text-blue-600" />
                  <span>
                    {new Date(interview.scheduledAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2 text-green-600" />
                  <span>
                    {interview.time} ({interview.duration} min)
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <>
                    <Video size={16} className="mr-2 text-purple-600" />
                    <span>Video Interview</span>
                  </>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {interview.round}
                  </span>
                </div>
              </div>

              {interview.evaluation && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Interview Evaluation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Communication
                        </span>
                        <MessageSquare size={16} className="text-blue-600" />
                      </div>
                      <RatingStars
                        rating={interview.evaluation.ratings.communication}
                      />
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Technical
                        </span>
                        <Code size={16} className="text-green-600" />
                      </div>
                      <RatingStars
                        rating={interview.evaluation.ratings.technical}
                      />
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Culture Fit
                        </span>
                        <Users size={16} className="text-purple-600" />
                      </div>
                      <RatingStars
                        rating={interview.evaluation.ratings.cultureFit}
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Evaluation Notes
                    </h5>
                    <p className="text-gray-600 text-sm">
                      {interview.evaluation.notes}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        interview.evaluation.recommendation === "hire"
                          ? "bg-green-100 text-green-800"
                          : interview.evaluation.recommendation === "hold"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {interview.evaluation.recommendation === "hire" &&
                        "Recommended for Hire"}
                      {interview.evaluation.recommendation === "hold" &&
                        "Hold for Further Review"}
                      {interview.evaluation.recommendation === "reject" &&
                        "Not Recommended"}
                    </span>
                  </div>
                </div>
              )}

              {/* <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {interview.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {interview.notes && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Interview Notes
                    </h4>
                    <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-4">
                      {interview.notes}
                    </p>
                  </div>
                )}
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* Hire Confirmation Modal */}
      {showHireModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            {/* Modal Header */}
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Hire
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  This action will update the candidate's status
                </p>
              </div>
            </div>

            {/* Enhanced File Upload Section */}
            <div className="mb-6">
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center transition-colors
            hover:border-green-300 hover:bg-green-50 relative group"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(
                    "border-green-400",
                    "bg-green-50"
                  );
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-green-400",
                    "bg-green-50"
                  );
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file.type === "application/pdf") {
                    setSelectedFile(file);
                  }
                  e.currentTarget.classList.remove(
                    "border-green-400",
                    "bg-green-50"
                  );
                }}
              >
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Drag PDF offer letter here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      or browse from your device
                    </p>
                  </div>
                  <label
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded-md 
              hover:bg-green-700 cursor-pointer transition-colors text-sm"
                  >
                    Select File
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Selected File Preview */}
              {selectedFile && (
                <div className="mt-4 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-800 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-600">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      window.open(URL.createObjectURL(selectedFile), "_blank")
                    }
                    className="text-green-600 hover:text-green-700 text-sm flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                </div>
              )}
            </div>

            {/* Existing Info Box */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                Are you sure you want to hire this candidate? This action will:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-green-700">
                <li>• Move the candidate to hired status</li>
                <li>• Send notification to relevant team members</li>
                <li>• Generate onboarding documentation</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowHireModal(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleHire(showHireModal, selectedFile)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center transition-colors"
                disabled={isLoading || !selectedFile}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Hiring...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} className="mr-2" />
                    Confirm Hire
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Rejection
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={4}
                placeholder="Enter detailed rejection reason..."
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {rejectionReason.length}/500
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-red-800">
                Are you sure you want to reject this candidate? This action
                will:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-red-700">
                <li>• Move the candidate to rejected status</li>
                <li>• Send rejection notification</li>
                <li>• Archive the application</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectionReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal, rejectionReason)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center disabled:opacity-50"
                disabled={!rejectionReason.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle size={18} className="mr-2" />
                    Confirm Rejection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InProgress;
