import React from "react";
import { Calendar, Clock, Video, Phone, User } from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboard";
import {
  formatDate,
  formatTime,
  getRelativeDateLabel,
} from "../../lib/dateUtil";

const UpcomingInterviews: React.FC = () => {
  const { loading, error, data } = useDashboardData();

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 animate-pulse">
        <div className="h-8 w-1/2 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Upcoming Interviews
        </h2>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">
            Error loading interview data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Get interview type icon
  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "phone":
        return <Phone className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            Upcoming Interviews
          </h2>
        </div>

        {data?.interviews && data.interviews.length > 0 ? (
          <div className="space-y-4">
            {data.interviews.slice(0, 5).map((interview) => (
              <div
                key={interview.id}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex space-x-3">
                    <div className="relative">
                      <img
                        src={
                          interview.candidateAvatar ||
                          "https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        }
                        alt={interview.candidateName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {interview.candidateName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {interview.position}
                      </p>
                      <div className="mt-1 flex items-center space-x-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(interview.date)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          {getInterviewTypeIcon(interview.type)}
                          <span className="ml-1 capitalize">
                            {interview.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {getRelativeDateLabel(interview.date)}
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {formatDate(interview.date)}
                  </span>
                  <a
                    href={`#interview/${interview.id}`}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
            {data.interviews.length > 5 && (
              <div className="text-center">
                <a
                  href="#interviews"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all interviews
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 mb-1">No upcoming interviews</p>
            <a
              href="#schedule-interview"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
            >
              Schedule an interview
              <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Import at the top
import { ArrowRight } from "lucide-react";

export default UpcomingInterviews;
