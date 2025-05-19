import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Search,
  ArrowRight,
} from "lucide-react";
import { listJobInterviewService } from "@/services/interview";
import { useParams } from "react-router-dom";
import { formatDate } from "@/lib/utils";

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
  job: Job;
  scheduledAt: string;
  duration: string;
  time: string;
  timeZone: string;
  roomId: string;
  meetingLink: string;
  round: string;
  mode: "video" | "in-person";
  status: "scheduled" | "completed" | "cancelled";
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Candidate {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  resume: string;
}

interface Job {
  _id: string;
  company: string;
  title: string;
  type: string;
  location: string;
  department: string;
  description: string;
  salary: string;
  experienceLevel: string;
  requirements: string[];
  responsibilities: string[];
  requiredSkills: string[];
  status: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deleted: boolean;
  tags: string[];
}

const InterviewsTab: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "scheduled" | "completed" | "cancelled"
  >("all");
  const [, setCurrentTime] = useState(new Date());
  const jobId = useParams().jobId;
  useEffect(() => {
    const fetchInterviews = async (jobId: string) => {
      const response = await listJobInterviewService(jobId);
      console.log(response, "interviews from server");
      setInterviews(response.data.interviews);
      console.log(response.data.interviews);
      setIsLoading(false);
    };
    fetchInterviews(jobId!);
  }, [jobId]);

  const parseInterviewTime = (interview: Interview): Date => {
    const scheduledDate = new Date(interview.scheduledAt);
    const datePart = scheduledDate.toISOString().split("T")[0];
    const time = interview.time;
    const timeZone = interview.timeZone;

    const offsetMatch = timeZone.match(/UTC([+-]\d+)/);
    if (!offsetMatch) {
      return new Date(`${datePart}T${time}:00Z`);
    }

    const offsetSign = offsetMatch[1].startsWith("-") ? "-" : "+";
    const offsetHours = offsetMatch[1].replace(offsetSign, "").padStart(2, "0");
    const isoOffset = `${offsetSign}${offsetHours}:00`;
    const dateTimeString = `${datePart}T${time}:00${isoOffset}`;

    return new Date(dateTimeString);
  };

  const isInterviewSoon = (interview: Interview) => {
    const now = new Date();
    const interviewTime = parseInterviewTime(interview);
    const timeDiff = interviewTime.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 36000000; // Within 1 hour
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  const getStatusBadgeColor = (status: string, isUpcoming: boolean) => {
    if (isUpcoming) return "bg-purple-100 text-purple-800";
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInterviews = interviews?.filter((interview) => {
    const matchesSearch =
      interview?.application?.candidate?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      interview?.application?.candidate.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || interview.status === filterStatus;
    const matchesDate = !selectedDate || interview.scheduledAt === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 ">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Interview Schedule
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and track your upcoming interviews
            </p>
          </div>
          {/* <button
            onClick={() => setShowScheduleModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Schedule Interview
          </button> */}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by candidate name or email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "all"
                    | "scheduled"
                    | "completed"
                    | "cancelled"
                )
              }
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading interviews...</p>
          </div>
        ) : filteredInterviews?.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No interviews found
            </h3>
            <p className="text-gray-600 mb-6">
              There are no interviews matching your criteria.
            </p>
            {/* <button
              onClick={() => setShowScheduleModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Schedule New Interview
            </button> */}
          </div>
        ) : (
          filteredInterviews?.map((interview) => {
            const isUpcoming = true;
            return (
              <div
                key={interview._id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <img
                      src={`${import.meta.env.VITE_S3_PATH}/${
                        interview?.application?.candidate?.profileImage
                      }`}
                      alt={interview?.application?.candidate?.name}
                      className="w-12 h-12 rounded-full ring-2 ring-white shadow-md"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {interview?.application?.candidate?.name}
                      </h3>
                      <p className="text-gray-600">
                        {interview?.application?.candidate?.email}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5" />
                          {formatDate(interview.scheduledAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5" />
                          {interview.time} ({interview.duration})
                        </span>
                        <span className="flex items-center">
                          {interview.mode === "video" ? (
                            <Video className="w-4 h-4 mr-1.5" />
                          ) : (
                            <MapPin className="w-4 h-4 mr-1.5" />
                          )}
                          {interview.mode === "video"
                            ? "Video Call"
                            : "In-Person"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeColor(
                        interview.status,
                        isUpcoming
                      )}`}
                    >
                      {isUpcoming
                        ? "Starting Soon"
                        : interview.status.charAt(0).toUpperCase() +
                          interview.status.slice(1)}
                    </span>
                    {isUpcoming && interview.mode === "video" && (
                      <a
                        href={interview.meetingLink}
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 shadow-md"
                      >
                        Join Meeting
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-6">
                    {/* <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 font-medium">
                        Interviewers:
                      </span>
                      <div className="flex -space-x-2 ml-2">
                        {interview?.interviewers.map((interviewer, index) => (
                          <img
                            key={index}
                            src={interviewer.avatar}
                            alt={interviewer.name}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            title={`${interviewer.name} - ${interviewer.role}`}
                          />
                        ))}
                      </div>
                    </div> */}
                    {interview.mode === "in-person" && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm">
                          {interview.application.location}
                        </span>
                      </div>
                    )}
                  </div>
                  {interview.note && (
                    <div className="mt-3 text-sm text-gray-600 border-t border-gray-200 pt-3">
                      <strong className="font-medium text-gray-700">
                        Notes:
                      </strong>{" "}
                      {interview.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InterviewsTab;
