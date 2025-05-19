import React from "react";

import { AlertCircle } from "lucide-react";
import { JobApplication } from "./JobApplications";

interface RejectedApplicationProps {
  application: JobApplication;
}

const RejectedApplication: React.FC<RejectedApplicationProps> = ({
  application,
}) => {
  return (
    <div className="mt-4 border border-red-200 bg-red-50 rounded-lg p-4 animate-fadeIn">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Application Rejected
          </h3>
          {application.rejectionReason ? (
            <div className="mt-2 text-sm text-red-700">
              <p>Reason for rejection:</p>
              <p className="mt-1 italic">{application.rejectionReason}</p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-red-700">
              We're sorry, but the company has decided not to move forward with
              your application.
            </p>
          )}
          <div className="mt-4">
            <p className="text-xs text-red-600">
              You can continue exploring other opportunities. Good luck with
              your job search!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedApplication;
