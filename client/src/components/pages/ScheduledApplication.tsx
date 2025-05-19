import React from "react";
import { Calendar, Clock, Link, FileText } from "lucide-react";
import { JobApplication } from "./JobApplications";

interface ScheduledApplicationProps {
  application: JobApplication;
}

const ScheduledApplication: React.FC<ScheduledApplicationProps> = ({
  application,
}) => {
  if (!application.interviewDetails) return null;

  const { date, time, meetingLink, preparationDocs } =
    application.interviewDetails;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mt-4 border border-yellow-200 bg-yellow-50 rounded-lg p-4 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        Upcoming Interview
      </h3>

      <div className="space-y-3">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-sm text-gray-700">{formatDate(date)}</span>
        </div>

        <div className="flex items-center">
          <Clock className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-sm text-gray-700">{time}</span>
        </div>

        {meetingLink && (
          <div className="flex items-center">
            <Link className="h-5 w-5 text-yellow-600 mr-2" />
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Meeting Link
            </a>
          </div>
        )}
      </div>

      {preparationDocs && preparationDocs.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Interview Preparation Documents
          </h4>
          <ul className="space-y-2">
            {preparationDocs.map((doc, index) => (
              <li key={index}>
                <a
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Preparation Document {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-150"
          onClick={() => window.open(meetingLink, "_blank")}
        >
          Join Interview
        </button>
      </div>
    </div>
  );
};

export default ScheduledApplication;
