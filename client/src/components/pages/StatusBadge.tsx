import React from "react";

interface StatusBadgeProps {
  status: "applied" | "scheduled" | "interviewed" | "hired" | "rejected";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "applied":
        return "bg-blue-50 text-blue-700 border-blue-100 ring-blue-100";
      case "scheduled":
        return "bg-yellow-50 text-yellow-700 border-yellow-100 ring-yellow-100";
      case "interviewed":
        return "bg-purple-50 text-purple-700 border-purple-100 ring-purple-100";
      case "hired":
        return "bg-green-50 text-green-700 border-green-100 ring-green-100";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-100 ring-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100 ring-gray-100";
    }
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        border ring-1 ring-inset
        transition-all duration-200
        ${getStatusStyles()}
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
