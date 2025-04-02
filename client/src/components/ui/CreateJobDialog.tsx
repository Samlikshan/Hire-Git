import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Briefcase,
  Users,
  MapPin,
  DollarSign,
  GraduationCap,
  CheckCircle2,
  Target,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  Rocket,
  Star,
  Clock,
  ListChecks,
  Calendar,
  Code,
} from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import type { Job } from "@/types/job";
import { createJobPostService } from "@/services/job";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";

interface CreateJobFormProps {
  onClose: () => void;
  onSubmit: (job: Job) => void;
}

export function CreateJobForm({ onClose, onSubmit }: CreateJobFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: "",
    type: "",
    location: "",
    department: "",
    description: "",
    salary: "",
    experienceLevel: "",
    requirements: [],
    responsibilities: [],
    requiredSkills: [],
    tags: [],
    status: "draft",
    deadline: "",
  });

  const [requirement, setRequirement] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [requiredSkill, setRequiredSkill] = useState("");
  const [tag, setTag] = useState("");

  const user = useSelector((state: RootState) => state.user.userData);

  const handleSubmit = async () => {
    if (!formData.title || !formData.department || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await createJobPostService({
        ...formData,
        company: user._id,
      });
      console.log(response, "respnse from createjob post");
      if (response.status == 200) {
        onClose();
        toast.success("Job posting created successfully!");
        onSubmit({
          ...formData,
          id: Date.now().toString(),
          applicants: 0,
          posted: "Just now",
          requirements: formData.requirements || [],
          responsibilities: formData.responsibilities || [],
          requiredSkills: formData.requiredSkills || [],
          tags: formData.tags || [],
          status: formData.status as "active" | "draft" | "closed",
        } as Job);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.error || "Job post creating falied");
    }
  };

  const addRequirement = () => {
    if (requirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...(prev.requirements || []), requirement.trim()],
      }));
      setRequirement("");
    }
  };

  const addResponsibility = () => {
    if (responsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [
          ...(prev.responsibilities || []),
          responsibility.trim(),
        ],
      }));
      setResponsibility("");
    }
  };

  const addRequiredSkill = () => {
    if (requiredSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...(prev.requiredSkills || []), requiredSkill.trim()],
      }));
      setRequiredSkill("");
    }
  };

  const addTag = () => {
    if (tag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()],
      }));
      setTag("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index),
    }));
  };

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities?.filter((_, i) => i !== index),
    }));
  };

  const removeRequiredSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills?.filter((_, i) => i !== index),
    }));
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  const getProgress = () => {
    const total = 10;
    let completed = 0;

    if (formData.title) completed++;
    if (formData.department) completed++;
    if (formData.location) completed++;
    if (formData.type) completed++;
    if (formData.experienceLevel) completed++;
    if (formData.deadline) completed++;
    if (formData.description) completed++;
    if (formData.requirements?.length) completed++;
    if (formData.responsibilities?.length) completed++;
    if (formData.requiredSkills?.length) completed++;

    return (completed / total) * 100;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-6 gap-0 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gray-100 rounded-xl">
            <Briefcase className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Create New Position
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details to create a new job posting
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setStep(1)}
            className={`flex-1 p-4 rounded-lg border transition-all ${
              step === 1
                ? "bg-gray-50 border-gray-200 shadow-sm"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 1
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                1
              </div>
              <span
                className={
                  step === 1 ? "text-gray-900 font-medium" : "text-gray-500"
                }
              >
                Basic Information
              </span>
            </div>
            <p className="text-sm text-gray-500 ml-11">
              Job title, department, and location
            </p>
          </button>

          <button
            onClick={() => setStep(2)}
            className={`flex-1 p-4 rounded-lg border transition-all ${
              step === 2
                ? "bg-gray-50 border-gray-200 shadow-sm"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 2
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                2
              </div>
              <span
                className={
                  step === 2 ? "text-gray-900 font-medium" : "text-gray-500"
                }
              >
                Job Details
              </span>
            </div>
            <p className="text-sm text-gray-500 ml-11">
              Description, requirements, and responsibilities
            </p>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 min-h-0">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="title"
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        Job Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g. Senior Frontend Developer"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="department"
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Users className="w-4 h-4 text-gray-500" />
                        Department <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        placeholder="e.g. Engineering"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="location"
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <MapPin className="w-4 h-4 text-gray-500" />
                        Location <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g. Remote, US"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="deadline"
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Application Deadline{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) =>
                          setFormData({ ...formData, deadline: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="type"
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Target className="w-4 h-4 text-gray-500" />
                        Job Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger id="type" className="mt-2">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="experience"
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        Experience Level
                      </Label>
                      <Input
                        id="experience"
                        value={formData.experienceLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experienceLevel: e.target.value,
                          })
                        }
                        placeholder="e.g. 3-5 years"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="salary"
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        Salary Range
                      </Label>
                      <Input
                        id="salary"
                        value={formData.salary}
                        onChange={(e) =>
                          setFormData({ ...formData, salary: e.target.value })
                        }
                        placeholder="e.g. $120,000 - $150,000"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={() => setStep(2)} className="gap-2">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <Star className="w-4 h-4 text-gray-500" />
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the role and responsibilities..."
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-gray-700">
                    <ListChecks className="w-4 h-4 text-gray-500" />
                    Responsibilities
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={responsibility}
                      onChange={(e) => setResponsibility(e.target.value)}
                      placeholder="Add a responsibility"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addResponsibility())
                      }
                    />
                    <Button
                      onClick={addResponsibility}
                      variant="outline"
                      className="shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {formData.responsibilities?.map((resp, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg group hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm text-gray-700">{resp}</span>
                        <button
                          onClick={() => removeResponsibility(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-gray-500" />
                    Requirements
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      placeholder="Add a requirement"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addRequirement())
                      }
                    />
                    <Button
                      onClick={addRequirement}
                      variant="outline"
                      className="shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {formData.requirements?.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg group hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm text-gray-700">{req}</span>
                        <button
                          onClick={() => removeRequirement(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-gray-700">
                    <Code className="w-4 h-4 text-gray-500" />
                    Required Skills
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={requiredSkill}
                      onChange={(e) => setRequiredSkill(e.target.value)}
                      placeholder="Add a required skill"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addRequiredSkill())
                      }
                    />
                    <Button
                      onClick={addRequiredSkill}
                      variant="outline"
                      className="shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.requiredSkills?.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="pl-3 pr-2 py-1 flex items-center gap-1"
                      >
                        {skill}
                        <button
                          onClick={() => removeRequiredSkill(index)}
                          className="hover:bg-gray-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-gray-700">
                    <Target className="w-4 h-4 text-gray-500" />
                    Tags
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button
                      onClick={addTag}
                      variant="outline"
                      className="shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="pl-3 pr-2 py-1 flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="hover:bg-gray-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as "active" | "draft" | "closed",
                      })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous Step
                  </Button>
                  <Button onClick={handleSubmit} className="gap-2">
                    Create Job <Rocket className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar - Now in a fixed position at the bottom */}
        <div className="mt-6 pt-6 border-t flex-shrink-0">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Completion Progress</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gray-900"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
