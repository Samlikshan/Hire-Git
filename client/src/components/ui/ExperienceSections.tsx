import { useEffect, useState } from "react";
import { Plus, Calendar, Building2, Trash } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./dialog";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { addExperienceService } from "@/services/candidate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { updateUserData } from "@/reducers/userSlice";
import { toast } from "sonner";

interface Experience {
  _id?: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export default function ExperienceSection() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[] | []>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (!userData) return;
    setExperiences(userData.experience);
  }, [userData]);

  const handleDeleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp._id !== id));
    setConfirmDeleteId(null);
  };

  const handleClick = async () => {
    try {
      const { jobTitle, company, startDate, endDate, location, description } =
        formData;
      const newErrors: Record<string, string> = {};
      const today = new Date();
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;

      // Validation checks
      if (!jobTitle.trim()) newErrors.jobTitle = "Job title is required";
      if (!company.trim()) newErrors.company = "Company is required";
      if (!location.trim()) newErrors.location = "Location is required";
      if (!startDate) newErrors.startDate = "Start date is required";
      if (!endDate) newErrors.endDate = "End date is required";

      if (startDateObj && startDateObj > today) {
        newErrors.startDate = "Start date cannot be in the future";
      }

      if (endDateObj) {
        if (endDateObj > today) {
          newErrors.endDate = "End date cannot be in the future";
        }
        if (startDateObj && endDateObj < startDateObj) {
          newErrors.endDate = "End date must be after start date";
        }
      }

      experiences.map((experience) => {
        if (
          experience.jobTitle.trim().toLowerCase() ==
          jobTitle.trim().toLocaleLowerCase()
        ) {
          toast.error("Experience cant be duplicate");
          newErrors.jobTitle = "Job title is duplicated";
          return;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Call the API to add the new experience
      const response = await addExperienceService({
        jobTitle: jobTitle,
        company,
        startDate,
        endDate,
        location,
        description,
      });

      if (response.status === 200) {
        setExperiences([
          ...experiences,
          {
            _id: (experiences.length + 1).toString(),
            jobTitle,
            company,
            location,
            startDate,
            endDate,
            description: formData.description,
            // current: endDate === "",
          },
        ]);
        setIsOpen(false);
        if (userData) {
          dispatch(
            updateUserData({
              experience: [
                {
                  jobTitle: jobTitle,
                  company,
                  location,
                  startDate,
                  endDate,
                  description,
                },
                ...userData.experience,
              ],
            })
          );
        }

        setFormData({
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        }); // Reset form
      }
    } catch (error) {
      console.error("Error adding experience:", error);
      // Handle error (e.g., show a notification)
    }
  };
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);
  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-700">Experience</h2>
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          <Plus size={16} />
          Add Experience
        </Button>
      </div>

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp._id}
            className="relative group border-l-2 border-blue-500 pl-6 pb-6 hover:bg-gray-50 rounded-r-lg transition-all duration-300"
          >
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white" />

            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {exp.jobTitle}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={16} />
                  <span>{exp.company}</span>
                  <span className="text-gray-400">•</span>
                  <span>{exp.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar size={14} />
                  <span>
                    {new Date(exp.startDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {!exp.endDate
                      ? "Present"
                      : new Date(exp.endDate).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                  </span>
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setConfirmDeleteId(exp._id!)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>

            <p className="mt-3 text-gray-600 leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </div>

      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this experience entry? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                confirmDeleteId && handleDeleteExperience(confirmDeleteId)
              }
            >
              Delete Experience
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Experience</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="jobTitle" className="text-sm font-medium">
                Job Title
              </label>
              <Input
                id="jobTitle"
                placeholder="e.g. Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => {
                  setFormData({ ...formData, jobTitle: e.target.value });
                  setErrors((prev) => ({ ...prev, jobTitle: "" }));
                }}
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-sm">{errors.jobTitle}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Input
                id="company"
                placeholder="e.g. Tech Corp"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">{errors.startDate}</p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">{errors.endDate}</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe your role and achievements..."
                className="resize-none"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleClick}>
              Save Experience
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
