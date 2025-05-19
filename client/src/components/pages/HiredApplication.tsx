import React, { useState } from "react";

import { Download, Check, X } from "lucide-react";
import FileUploader from "./FileUploader";
import DeclineOfferModal from "./DeclineOfferModal";
import { JobApplication } from "./JobApplications";

interface HiredApplicationProps {
  application: JobApplication;
  onAcceptOffer: (file: File) => void;
  onDeclineOffer: (reason: string) => void;
}

const HiredApplication: React.FC<HiredApplicationProps> = ({
  application,
  onAcceptOffer,
  onDeclineOffer,
}) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  const handleAcceptClick = () => {
    if (selectedFile) {
      onAcceptOffer(selectedFile);
    }
  };

  const handleDeclineSubmit = (reason: string) => {
    onDeclineOffer(reason);
    setShowDeclineModal(false);
  };

  if (!application.offerLetter) return null;

  // If offer has been already accepted
  if (application.offerLetter.accepted) {
    return (
      <div className="mt-4 border border-green-200 bg-green-50 rounded-lg p-4 animate-fadeIn">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Offer Accepted
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Congratulations! You've accepted the offer on{" "}
              {new Date(
                application.offerLetter.acceptedDate!
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {application.offerLetter.signedPdf && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Your Signed Offer Letter
            </h4>
            <a
              href={application.offerLetter.signedPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="-ml-0.5 mr-2 h-4 w-4" />
              View Signed Offer
            </a>
          </div>
        )}
      </div>
    );
  }

  // If offer has been declined
  if (application.offerLetter.declined) {
    return (
      <div className="mt-4 border border-red-200 bg-red-50 rounded-lg p-4 animate-fadeIn">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Offer Declined</h3>
            <p className="mt-1 text-sm text-red-700">
              You've declined this offer on{" "}
              {new Date(
                application.offerLetter.declinedDate!
              ).toLocaleDateString()}
            </p>
            {application.offerLetter.declineReason && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-800">Your reason:</p>
                <p className="mt-1 text-sm text-red-700 italic">
                  "{application.offerLetter.declineReason}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default state - offer pending response
  return (
    <div className="mt-4 border border-green-200 rounded-lg p-4 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Offer Letter</h3>

      <div className="bg-white rounded-md shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-900">
            Job Offer Document
          </h4>
          <a
            href={application.offerLetter.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="-ml-0.5 mr-1 h-3 w-3" />
            Download
          </a>
        </div>

        <div className="mt-2 h-64 bg-gray-100 rounded-md flex items-center justify-center">
          <iframe
            src={application.offerLetter.pdf}
            title="Offer Letter Preview"
            className="w-full h-full rounded-md"
          />
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Your Response
        </h4>

        <div className="mb-4">
          <FileUploader
            acceptedFileTypes="application/pdf"
            maxFileSizeMB={5}
            onFileSelected={handleFileSelected}
            label="Upload Signed Offer Letter (PDF)"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleAcceptClick}
            disabled={!selectedFile}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${
              selectedFile
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <Check className="mr-1.5 h-4 w-4" />
            Accept Offer
          </button>
          <button
            type="button"
            onClick={() => setShowDeclineModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
          >
            <X className="mr-1.5 h-4 w-4" />
            Decline Offer
          </button>
        </div>
      </div>

      {showDeclineModal && (
        <DeclineOfferModal
          onClose={() => setShowDeclineModal(false)}
          onSubmit={handleDeclineSubmit}
        />
      )}
    </div>
  );
};

export default HiredApplication;
