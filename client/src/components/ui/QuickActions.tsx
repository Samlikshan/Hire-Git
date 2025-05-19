import React from "react";
import { Briefcase, Users, Calendar, Settings, ArrowRight } from "lucide-react";

const QuickActions: React.FC = () => {
  // Define quick action buttons
  const actions = [
    {
      id: 1,
      name: "Create New Job",
      description: "Post a new job listing",
      icon: Briefcase,
      color: "bg-indigo-500",
      href: "#create-job",
    },
    {
      id: 2,
      name: "Review Applications",
      description: "Check pending applications",
      icon: Users,
      color: "bg-emerald-500",
      href: "#applications",
    },
    {
      id: 3,
      name: "Schedule Interviews",
      description: "Set up meetings with candidates",
      icon: Calendar,
      color: "bg-amber-500",
      href: "#schedule",
    },
    {
      id: 4,
      name: "Manage Settings",
      description: "Update company profile",
      icon: Settings,
      color: "bg-blue-500",
      href: "#settings",
    },
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {actions.map((action) => (
            <a
              key={action.id}
              href={action.href}
              className="group flex items-center p-4 bg-white border border-gray-200 rounded-lg transition-all hover:border-gray-300 hover:shadow-sm"
            >
              <div className={`${action.color} rounded-lg p-2 mr-4`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {action.name}
                </h3>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
              <div className="text-gray-400 group-hover:text-indigo-600 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
