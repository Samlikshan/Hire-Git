// CandidateCard.tsx
import React from "react";
import { useDrag } from "react-dnd";
import { Calendar, Clock, MoreVertical, ChevronDown } from "lucide-react";

interface Applicant {
  _id: string;
  candidate: {
    _id: string;
    name: string;
    email: string;
    skills: string[];
    profileImage: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  currentTitle: string;
  expectedSalary: string;
  resume: string;
  coverLetter: string;
  experience?: string;
  education?: string;
  status: "applied" | "shortlisted" | "hired" | "rejected";
}

interface CandidateCardProps {
  applicant: Applicant;
  onClick: () => void;
  onStatusChange: (
    status: "applied" | "shortlisted" | "hired" | "rejected"
  ) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  applicant,
  onClick,
  onStatusChange,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "candidate",
    item: {
      type: "candidate",
      id: applicant._id,
      status: applicant.status,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [showDropdown, setShowDropdown] = React.useState(false);

  const statusOptions = [
    { value: "applied", label: "Move to Applied" },
    { value: "shortlisted", label: "Move to Shortlisted" },
    { value: "hired", label: "Move to Hired" },
    { value: "rejected", label: "Move to Rejected" },
  ].filter((option) => option.value !== applicant.status);
  console.log(applicant);
  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${
        isDragging ? "opacity-50 scale-95" : "opacity-100 hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center" onClick={onClick}>
          <img
            src={`${import.meta.env.VITE_S3_PATH}/${
              applicant.candidate.profileImage
            }`}
            alt={`${applicant.firstName} ${applicant.lastName}`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-medium text-gray-800">
              {applicant.firstName} {applicant.lastName}
            </h3>
            <p className="text-gray-500 text-xs">{applicant.candidate.email}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(
                      option.value as
                        | "applied"
                        | "shortlisted"
                        | "hired"
                        | "rejected"
                    );
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {applicant.candidate.skills && applicant.candidate.skills.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {applicant.candidate.skills.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
            {applicant.candidate.skills.length > 2 && (
              <button
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle showing all skills
                }}
              >
                +{applicant.candidate.skills.length - 2}{" "}
                <ChevronDown size={12} className="ml-0.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center">
          <Calendar size={12} className="mr-1" />
          <span>{applicant.experience} years</span>
        </div>
        <div className="flex items-center">
          <Clock size={12} className="mr-1" />
          <span>{applicant.education}</span>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
