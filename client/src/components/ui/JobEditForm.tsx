import React, { useState } from "react";
import {
  X,
  Plus,
  DollarSign,
  MapPin,
  Briefcase,
  Calendar,
  Tags,
  Save,
  ArrowLeft,
} from "lucide-react";
import type { Job } from "@/types/job";

interface JobEditFormProps {
  job: Job;
  onSave: (job: Job) => void;
  onCancel: () => void;
}

const JobEditForm: React.FC<JobEditFormProps> = ({
  job: initialJob,
  onSave,
  onCancel,
}) => {
  const [job, setJob] = useState<Job>(initialJob);
  const [newTag, setNewTag] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTagAdd = () => {
    if (newTag.trim() && !job.tags?.includes(newTag.trim())) {
      setJob({
        ...job,
        tags: [...(job.tags || []), newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setJob({
      ...job,
      tags: job.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const handleResponsibilityAdd = () => {
    if (newResponsibility.trim()) {
      setJob({
        ...job,
        responsibilities: [...job.responsibilities, newResponsibility.trim()],
      });
      setNewResponsibility("");
    }
  };

  const handleRequirementAdd = () => {
    if (newRequirement.trim()) {
      setJob({
        ...job,
        requirements: [...job.requirements, newRequirement.trim()],
      });
      setNewRequirement("");
    }
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !job.requiredSkills.includes(newSkill.trim())) {
      setJob({
        ...job,
        requiredSkills: [...job.requiredSkills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!job.title.trim()) newErrors.title = "Job title is required";
    if (!job.department.trim()) newErrors.department = "Department is required";
    if (!job.salary.trim()) newErrors.salary = "Salary range is required";
    if (!job.location.trim()) newErrors.location = "Location is required";
    if (!job.description.trim())
      newErrors.description = "Description is required";

    const deadlineDate = new Date(job.deadline);
    if (isNaN(deadlineDate.getTime())) {
      newErrors.deadline = "Invalid deadline date";
    } else if (deadlineDate < new Date()) {
      newErrors.deadline = "Deadline cannot be in the past";
    }

    if (job.responsibilities.length === 0)
      newErrors.responsibilities = "At least one responsibility is required";
    if (job.requirements.length === 0)
      newErrors.requirements = "At least one requirement is required";
    if (job.requiredSkills.length === 0)
      newErrors.requiredSkills = "At least one skill is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(job);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onCancel}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Job Posting
            </h1>
          </div>

          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={job.title}
                    onChange={(e) => setJob({ ...job, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={job.department}
                    onChange={(e) =>
                      setJob({ ...job, department: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Engineering"
                  />
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      Salary Range
                    </div>
                  </label>
                  <input
                    type="text"
                    value={job.salary}
                    onChange={(e) => setJob({ ...job, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., $120,000 - $150,000"
                  />
                  {errors.salary && (
                    <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      Location
                    </div>
                  </label>
                  <input
                    type="text"
                    value={job.location}
                    onChange={(e) =>
                      setJob({ ...job, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., San Francisco, CA (Remote)"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-1" />
                      Employment Type
                    </div>
                  </label>
                  <select
                    value={job.type}
                    onChange={(e) => setJob({ ...job, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Application Deadline
                    </div>
                  </label>
                  <input
                    type="date"
                    value={job.deadline.split("T")[0]}
                    onChange={(e) =>
                      setJob({ ...job, deadline: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.deadline && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deadline}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-1" />
                      Status
                    </div>
                  </label>
                  <select
                    value={job.status}
                    onChange={(e) =>
                      setJob({
                        ...job,
                        status: e.target.value as "active" | "draft" | "closed",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Tags size={16} className="mr-1" />
                  Add tags for better searchability
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {job.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTagAdd()}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleTagAdd}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <Plus size={18} className="mr-2" />
                  Add Tag
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <textarea
                value={job.description}
                onChange={(e) =>
                  setJob({ ...job, description: e.target.value })
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a detailed job description..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Responsibilities */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Responsibilities
              </h2>
              <ul className="space-y-3 mb-4">
                {job.responsibilities.map((responsibility, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                  >
                    <span>{responsibility}</span>
                    <button
                      onClick={() =>
                        setJob({
                          ...job,
                          responsibilities: job.responsibilities.filter(
                            (_, i) => i !== index
                          ),
                        })
                      }
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleResponsibilityAdd()
                  }
                  placeholder="Add a responsibility"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  onClick={handleResponsibilityAdd}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <Plus size={18} className="mr-2" />
                  Add
                </button>
              </div>
              {errors.responsibilities && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.responsibilities}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Requirements
              </h2>
              <ul className="space-y-3 mb-4">
                {job.requirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                  >
                    <span>{requirement}</span>
                    <button
                      onClick={() =>
                        setJob({
                          ...job,
                          requirements: job.requirements.filter(
                            (_, i) => i !== index
                          ),
                        })
                      }
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleRequirementAdd()
                  }
                  placeholder="Add a requirement"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  onClick={handleRequirementAdd}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <Plus size={18} className="mr-2" />
                  Add
                </button>
              </div>
              {errors.requirements && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.requirements}
                </p>
              )}
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {skill}
                    <button
                      onClick={() =>
                        setJob({
                          ...job,
                          requiredSkills: job.requiredSkills.filter(
                            (_, i) => i !== index
                          ),
                        })
                      }
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSkillAdd()}
                  placeholder="Add a required skill"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  onClick={handleSkillAdd}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <Plus size={18} className="mr-2" />
                  Add Skill
                </button>
              </div>
              {errors.requiredSkills && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.requiredSkills}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobEditForm;
