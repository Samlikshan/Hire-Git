// components/JobApplicationCard.tsx
import React from "react";
import {
  Calendar,
  Building,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  Clock,
} from "lucide-react";
import { Interview } from "@/types/Interview";
import StatusBadge from "./StatusBadge";
import { toast } from "sonner";

interface JobApplicationCardProps {
  interview: Interview;
  onAcceptOffer: (interviewId: string, file: File) => void;
  onDeclineOffer: (interviewId: string, reason: string) => void;
}

const JobApplicationCard: React.FC<JobApplicationCardProps> = ({
  interview,
  onAcceptOffer,
  onDeclineOffer,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [showDeclineModal, setShowDeclineModal] = React.useState(false);
  const [declineReason, setDeclineReason] = React.useState("");

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted");
      return;
    }
    setSelectedFile(file);
  };

  const handleAccept = () => {
    if (!selectedFile) {
      toast.error("Please upload signed offer letter");
      return;
    }
    onAcceptOffer(interview._id, selectedFile);
  };

  const handleDecline = () => {
    if (!declineReason.trim()) {
      toast.error("Please provide a reason for declining");
      return;
    }
    onDeclineOffer(interview._id, declineReason);
    setShowDeclineModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
              {interview.job.company?.logo ? (
                <img
                  src={`${import.meta.env.VITE_S3_PATH}/${
                    interview.job.company.logo
                  }`}
                  alt={`${interview.job.company.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {interview.job.title}
              </h2>
              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-3.5 w-3.5 mr-1" />
                {interview.job.company?.name || "N/A"}
              </div>
            </div>
          </div>
          <StatusBadge status={interview.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{interview.job.location || "Remote"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            <span>{interview.job.salary || "Not specified"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>Scheduled {formatDate(interview.scheduledAt)}</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center py-1 text-sm text-gray-500 hover:text-gray-700"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {expanded && (
          <div className="mt-3 space-y-4">
            {interview.offerStatus === "rejected" &&
              interview.rejectionReason && (
                <div className="bg-red-50 p-4 rounded-md">
                  <h4 className="font-medium text-red-800 mb-2">
                    Application Rejected
                  </h4>
                  <div className="text-red-700 text-sm">
                    <p className="font-medium">Reason:</p>
                    <p>{interview.rejectionReason}</p>
                    {interview.updatedAt && (
                      <p className="mt-2 text-xs">
                        Rejected on {formatDate(interview.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            {interview.status === "scheduled" && (
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-800 mb-3">
                  Interview Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    {formatDate(interview.scheduledAt)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    {interview.time} ({interview.duration} mins)
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Video className="h-4 w-4 mr-2 text-blue-600" />
                    <a
                      href={interview.meetingLink}
                      className="text-blue-600 hover:underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                </div>
              </div>
            )}

            {interview.offerStatus === "pending" && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">
                      Offer Letter Available
                    </h4>
                    <a
                      href={`${import.meta.env.VITE_S3_PATH}/${
                        interview.offerLetter
                      }`}
                      target="_blank"
                      className="text-green-600 hover:underline flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Download Offer Letter
                    </a>
                  </div>
                  <p className="text-sm text-green-700">
                    Please review and respond by{" "}
                    {formatDate(interview.offerSentAt!)}
                  </p>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0])
                      }
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Upload Signed Offer Letter
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF format required
                      </p>
                    </div>
                  </label>
                  {selectedFile && (
                    <div className="mt-3 text-sm text-gray-600">
                      <FileText className="h-4 w-4 inline-block mr-2" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeclineModal(true)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Decline Offer
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Accept Offer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Decline Offer</h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason for declining"
              className="w-full p-3 border rounded-md mb-3"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationCard;
