import React, { useEffect, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CandidateCard from "./ui/CandidateCard";

import {
  AlertCircle,
  CheckCircle,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Briefcase,
  Phone,
  Award,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";
import {
  getJobApplicantsService,
  scheduleInterviewService,
  shortListCandidateService,
} from "@/services/job";
import { useParams } from "react-router-dom";
import ScheduleInterview from "./ui/scheduleInterview";

interface Applicant {
  _id: string;
  candidate: {
    _id: string;
    name: string;
    email: string;
    skills: string[];
    profileImage: string;
    socialLinks: { gitHub: string; linkedIn: string };
    bio?: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  location: string;
  currentTitle: string;
  expectedSalary: string;
  resume: string;
  coverLetter: string;
  experience?: string;
  education?: string;
  status: "applied" | "shortlisted" | "hired" | "rejected";
}

interface Column {
  id: "applied" | "shortlisted" | "hired" | "rejected";
  title: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  actionRequired?: boolean;
  actionTitle?: string;
  actionDescription?: string;
  actionButtons?: {
    confirm: string;
    cancel: string;
  };
}

const Column: React.FC<{
  column: Column;
  applicants: Applicant[];
  onDrop: (
    id: string,
    status: "applied" | "shortlisted" | "hired" | "rejected"
  ) => void;
  onCardClick: (applicant: Applicant) => void;
  onScheduleInterview: (applicationId: string) => void;
  showActionTooltip: { id: string; action: string } | null;
}> = ({
  column,
  applicants,
  onDrop,
  onCardClick,
  onScheduleInterview,
  showActionTooltip,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "candidate",
    drop: (item: { status: string; id: string }) => {
      if (item.status !== column.id) {
        onDrop(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`${column.bgColor} rounded-lg p-4 ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${column.color}`}
        >
          {column.icon}
          <span className="ml-1">{column.title}</span>
          <span className="ml-2 bg-white rounded-full px-1.5 py-0.5">
            {applicants.filter((a) => a.status === column.id).length}
          </span>
        </div>
        <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-white">
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-3 min-h-[200px]">
        {applicants
          .filter((applicant) => applicant.status === column.id)
          .map((applicant) => (
            <div key={applicant._id} className="relative">
              <CandidateCard
                applicant={applicant}
                onClick={() => onCardClick(applicant)}
                onStatusChange={(status) => onDrop(applicant._id, status)}
                onScheduleInterview={() => onScheduleInterview(applicant._id)}
              />
              {showActionTooltip && showActionTooltip.id === applicant._id && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-100 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                  {showActionTooltip.action === "shortlisted" &&
                    "Candidate shortlisted!"}
                  {showActionTooltip.action === "hired" && "Candidate hired!"}
                  {showActionTooltip.action === "rejected" &&
                    "Candidate rejected!"}
                  {showActionTooltip.action === "applied" &&
                    "Moved to applied!"}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

const CandidatesBoard: React.FC = () => {
  const { jobId } = useParams();
  const columns: Column[] = [
    {
      id: "applied",
      title: "APPLIED",
      color: "bg-yellow-100 text-yellow-800",
      bgColor: "bg-yellow-50",
      icon: <AlertCircle size={14} className="text-yellow-600" />,
    },
    {
      id: "shortlisted",
      title: "SHORTLISTED",
      color: "bg-blue-100 text-blue-800",
      bgColor: "bg-blue-50",
      icon: <CheckCircle size={14} className="text-blue-600" />,
      actionRequired: true,
      actionTitle: "Shortlist Candidate?",
      actionDescription: "Are you sure you want to shortlist this candidate?",
      actionButtons: {
        confirm: "Confirm Shortlist", // Changed from Schedule Interview
        cancel: "Cancel", // Changed from Just Shortlist
      },
    },
    {
      id: "hired",
      title: "HIRED",
      color: "bg-green-100 text-green-800",
      bgColor: "bg-green-50",
      icon: <CheckCircle size={14} className="text-green-600" />,
      actionRequired: true,
      actionTitle: "Confirm Hiring",
      actionDescription: "This will initiate the onboarding process. Continue?",
      actionButtons: {
        confirm: "Start Onboarding",
        cancel: "Cancel",
      },
    },
    {
      id: "rejected",
      title: "REJECTED",
      color: "bg-red-100 text-red-800",
      bgColor: "bg-red-50",
      icon: <AlertCircle size={14} className="text-red-600" />,
      actionRequired: true,
      actionTitle: "Send Rejection Email?",
      actionDescription:
        "Would you like to send a rejection email to the candidate?",
      actionButtons: {
        confirm: "Send Email",
        cancel: "Just Reject",
      },
    },
  ];

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [showSkillsChart, setShowSkillsChart] = useState(false);
  const [showActionTooltip, setShowActionTooltip] = useState<{
    id: string;
    action: string;
  } | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    candidateId: string;
    targetStatus: "applied" | "shortlisted" | "hired" | "rejected";
    column: Column;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [showScheduleInterview, setShowScheduleInterview] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  useEffect(() => {
    const getCandidates = async () => {
      if (!jobId) return;
      try {
        const response = await getJobApplicantsService(jobId);
        if (response.status === 200) {
          setApplicants(response.data.applicants);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCandidates();
  }, [jobId]);

  const handleActionConfirm = async () => {
    if (!pendingAction) return;

    const { candidateId, targetStatus, column } = pendingAction;

    setApplicants(
      applicants.map((applicant) =>
        applicant._id === candidateId
          ? { ...applicant, status: targetStatus }
          : applicant
      )
    );

    setShowActionTooltip({ id: candidateId, action: targetStatus });
    setTimeout(() => setShowActionTooltip(null), 2000);
    try {
      switch (targetStatus) {
        case "shortlisted":
          if (column.actionButtons?.confirm === "Confirm Shortlist") {
            setSelectedApplicant(
              applicants.find((c) => c._id === candidateId) || null
            );
            try {
              if (targetStatus === "shortlisted") {
                await shortListCandidateService(candidateId);
              }
              console.log(
                `Candidate ${candidateId} has been shortlisted. Sending notification.`
              );
            } catch (error) {
              console.log("Error updating status:", error);
            }
          }
          break;
        case "hired":
          console.log(
            `Candidate ${candidateId} has been hired. Initiating onboarding process.`
          );
          break;
        case "rejected":
          if (column.actionButtons?.confirm === "Send Email") {
            console.log(`Sending rejection email to candidate ${candidateId}`);
          }
          break;
      }
    } catch (error) {
      console.log("Error changing user status", error);
    }

    setShowActionModal(false);
    setPendingAction(null);
  };

  const moveCandidate = (
    id: string,
    targetStatus: "applied" | "shortlisted" | "hired" | "rejected"
  ) => {
    const candidate = applicants.find((c) => c._id === id);
    if (!candidate || candidate.status === targetStatus) return;

    const column = columns.find((col) => col.id === targetStatus);
    if (!column) return;

    if (column.actionRequired) {
      setPendingAction({ candidateId: id, targetStatus, column });
      setShowActionModal(true);
    } else {
      setApplicants(
        applicants.map((applicant) =>
          applicant._id === id
            ? { ...candidate, status: targetStatus }
            : candidate
        )
      );
      setShowActionTooltip({ id, action: targetStatus });
      setTimeout(() => setShowActionTooltip(null), 2000);
    }
  };

  const handleCandidateClick = (candidate: Applicant) => {
    setSelectedApplicant(candidate);
    setShowSkillsChart(true);
  };

  const handleScheduleInterview = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setShowScheduleInterview(true);
  };

  const scheduleInterview = async (data: {
    date: string;
    time: string;
    duration: string;
    timeZone: string;
    round: string;
    notes: string;
  }) => {
    if (!selectedApplicationId) return;
    await scheduleInterviewService({
      applicationId: selectedApplicationId,
      ...data,
    });
  };
  const filteredCandidates = applicants.filter((applicant) => {
    const matchesSearch =
      applicant?.candidate?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      applicant?.candidate?.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesSkills =
      filterSkills.length === 0 ||
      filterSkills.every((skill) =>
        applicant.candidate.skills?.includes(skill)
      );

    return matchesSearch && matchesSkills;
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Candidates</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 md:flex-none">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search candidates..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 relative group">
                <Filter size={16} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Filter by Skills
                    </h3>
                    <div className="space-y-2">
                      {["JavaScript", "React", "Node.js", "Python", "Java"].map(
                        (skill) => (
                          <label key={skill} className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={filterSkills.includes(skill)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilterSkills([...filterSkills, skill]);
                                } else {
                                  setFilterSkills(
                                    filterSkills.filter((s) => s !== skill)
                                  );
                                }
                              }}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {skill}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </button>
              <button className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                <SlidersHorizontal size={16} />
              </button>
              {/* <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <UserPlus size={16} className="mr-2" />
                Add Candidate
              </button> */}
            </div>
          </div>
        </div>

        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                applicants={filteredCandidates}
                onDrop={moveCandidate}
                onCardClick={handleCandidateClick}
                showActionTooltip={showActionTooltip}
                onScheduleInterview={handleScheduleInterview}
              />
            ))}
          </div>
        </DndProvider>
      </div>

      {showSkillsChart && selectedApplicant && (
        <div className="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Candidate Profile
                </h3>
                <button
                  onClick={() => setShowSkillsChart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                      <img
                        src={`${import.meta.env.VITE_S3_PATH}/${
                          selectedApplicant.candidate.profileImage
                        }`}
                        alt={selectedApplicant.candidate.name}
                        className="w-24 h-24 rounded-full mb-4 ring-4 ring-white shadow-lg"
                      />
                      <h4 className="text-xl font-bold text-gray-900">
                        {selectedApplicant.candidate.name}
                      </h4>
                      <p className="text-gray-600">{selectedApplicant.email}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600">
                        <Briefcase size={18} className="mr-3" />
                        <span>{selectedApplicant.experience} Experience</span>
                      </div>
                      {/* <div className="flex items-center text-gray-600">
                        <MapPin size={18} className="mr-3" />
                        <span>San Francisco, CA</span>
                      </div> */}
                      <div className="flex items-center text-gray-600">
                        <Phone size={18} className="mr-3" />
                        <span>{selectedApplicant.phone}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-3">
                        Social Profiles
                      </h5>
                      <div className="space-y-3">
                        <a
                          href={
                            selectedApplicant?.candidate?.socialLinks?.linkedIn
                          }
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Linkedin size={18} className="mr-3" />
                          <span>LinkedIn Profile</span>
                        </a>
                        <a
                          href={
                            selectedApplicant?.candidate?.socialLinks?.gitHub
                          }
                          className="flex items-center text-gray-700 hover:text-gray-900"
                        >
                          <Github size={18} className="mr-3" />
                          <span>GitHub Profile</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Globe size={18} className="mr-3" />
                          <span>Portfolio Website</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Skills & Experience */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 border border-gray-100">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">
                        Professional Summary
                      </h5>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedApplicant.candidate.bio}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-100">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">
                        Skills
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.candidate.skills?.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg p-6 border border-gray-100">
                        <div className="flex items-center mb-4">
                          <Award className="w-5 h-5 text-blue-600 mr-2" />
                          <h5 className="text-lg font-semibold text-gray-900">
                            Education
                          </h5>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {selectedApplicant.education}
                            </p>
                            <p className="text-sm text-gray-600">2015 - 2019</p>
                          </div>
                        </div>
                      </div>

                      {/* <div className="bg-white rounded-lg p-6 border border-gray-100">
                        <div className="flex items-center mb-4">
                          <Book className="w-5 h-5 text-blue-600 mr-2" />
                          <h5 className="text-lg font-semibold text-gray-900">
                            Certifications
                          </h5>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              AWS Certified Developer
                            </p>
                            <p className="text-sm text-gray-600">
                              Issued Dec 2022
                            </p>
                          </div>
                        </div>
                      </div> */}
                    </div>

                    {/* <div className="bg-white rounded-lg p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-semibold text-gray-900">
                          Skills Assessment
                        </h5>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock size={14} className="mr-1" />
                          Last updated: {selectedApplicant.lastActivity}
                        </div>
                      </div>
                      <SkillsChart />
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowSkillsChart(false);
                    moveCandidate(selectedApplicant.candidate._id, "rejected");
                  }}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setShowSkillsChart(false);
                    // setShowScheduleInterview(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showScheduleInterview && (
        <ScheduleInterview
          onClose={() => setShowScheduleInterview(false)}
          onSchedule={(data) => {
            scheduleInterview(data);
            setShowScheduleInterview(false);
          }}
        />
      )}
      {showActionModal && pendingAction && (
        <div className="fixed inset-0  bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {pendingAction.column.actionTitle}
              </h3>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setPendingAction(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              {pendingAction.column.actionDescription}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {pendingAction.column.actionButtons?.cancel || "Cancel"}
              </button>
              <button
                onClick={handleActionConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {pendingAction.column.actionButtons?.confirm || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesBoard;
