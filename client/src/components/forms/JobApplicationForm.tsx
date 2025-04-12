import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Loader2,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  User,
  FileText,
  DollarSign,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";

interface JobApplicationFormProps {
  jobTitle: string;
  company: string;
  companyLogo: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  education?: string;
  currentTitle?: string;
  experience?: string;
  expectedSalary?: string;
  resume?: string;
}

export function JobApplicationForm({
  jobTitle,
  company,
  companyLogo,
  isOpen,
  onClose,
  onSubmit,
}: JobApplicationFormProps) {
  const user = useSelector((state: RootState) => state.user.userData);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    education: "",
    currentTitle: "",
    experience: "",
    expectedSalary: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<File | null>(
    null
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(1);

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};

    if (stepNumber === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (
        !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
          formData.phone
        )
      ) {
        newErrors.phone = "Please enter a valid phone number";
      }

      if (!formData.location.trim())
        newErrors.location = "Location is required";
    }

    if (stepNumber === 2) {
      if (!formData.education)
        newErrors.education = "Education level is required";
      if (!formData.currentTitle.trim())
        newErrors.currentTitle = "Current title is required";

      if (!formData.experience) {
        newErrors.experience = "Experience is required";
      } else if (isNaN(Number(formData.experience))) {
        newErrors.experience = "Please enter a valid number";
      } else if (Number(formData.experience) < 0) {
        newErrors.experience = "Experience cannot be negative";
      }

      if (!formData.expectedSalary) {
        newErrors.expectedSalary = "Expected salary is required";
      } else if (isNaN(Number(formData.expectedSalary))) {
        newErrors.expectedSalary = "Please enter a valid number";
      } else if (Number(formData.expectedSalary) < 0) {
        newErrors.expectedSalary = "Salary cannot be negative";
      }
    }

    if (stepNumber === 3 && !selectedResume) {
      newErrors.resume = "Resume is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      if (validateStep(step)) {
        nextStep();
      }
      return;
    }

    // Final validation before submit
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const newformData = new FormData(form);

    for (const value of Object.entries(formData)) {
      newformData.append(value[0], value[1]);
    }

    if (user?._id) {
      newformData.append("candidate", user?._id);
    }

    try {
      await onSubmit(newformData);
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "coverLetter"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Only PDF, DOC, and DOCX files are allowed",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          resume: "File size must be less than 5MB",
        }));
        return;
      }

      if (type === "resume") {
        setSelectedResume(file);
      } else {
        setSelectedCoverLetter(file);
      }
      setErrors((prev) => ({ ...prev, resume: undefined }));
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  // Render the form with validation errors
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" // Changed max-w-2xl to max-w-md
            style={{ maxHeight: "90vh" }} // Added fixed max height
          >
            {/* Header */}
            <div className="relative p-8 border-b border-gray-100 bg-gradient-to-r from-blue-700 to-indigo-700">
              <div className="flex items-center gap-4">
                {/* Company Logo */}
                <div className="w-16 h-16 bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center">
                  <img
                    src={`${import.meta.env.VITE_S3_PATH}/${companyLogo}`}
                    alt={`${company} logo`}
                    className="w-full h-full "
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{jobTitle}</h2>
                  <p className="text-blue-100 mt-1 text-lg">{company}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="absolute right-8 top-8 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Progress Steps - Fixed alignment */}
              <div className="flex justify-center mt-10 px-4">
                <div className="flex items-center justify-between w-full max-w-md">
                  {[
                    { step: 1, label: "Personal Info", icon: User },
                    { step: 2, label: "Professional", icon: Briefcase },
                    { step: 3, label: "Documents", icon: FileText },
                  ].map((item, index) => (
                    <React.Fragment key={item.step}>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                            step === item.step
                              ? "bg-white text-blue-600 shadow-lg shadow-blue-500/30 scale-110"
                              : step > item.step
                              ? "bg-white text-blue-600"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-sm font-medium  whitespace-nowrap ${
                            step >= item.step ? "text-white" : "text-white/70"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      {index < 2 && (
                        <div className="w-16 md:w-24 h-1 mx-2 relative">
                          <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                          {step > item.step && (
                            <div className="absolute inset-0 bg-white rounded-full"></div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="p-6 pb-16 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 200px)" }}
            >
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 rounded-md">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              First Name
                            </div>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            className={`w-full px-4 py-3 border ${
                              errors.firstName
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 rounded-md">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              Last Name
                            </div>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            className={`w-full px-4 py-3 border ${
                              errors.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 rounded-md">
                              <Mail className="w-4 h-4 text-green-600" />
                            </div>
                            Email Address
                          </div>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className={`w-full px-4 py-3 border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                          placeholder="john.doe@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-100 rounded-md">
                              <Phone className="w-4 h-4 text-purple-600" />
                            </div>
                            Phone Number
                          </div>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className={`w-full px-4 py-3 border ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                          placeholder="(555) 555-5555"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-yellow-100 rounded-md">
                              <MapPin className="w-4 h-4 text-yellow-600" />
                            </div>
                            Location
                          </div>
                        </label>
                        <input
                          type="text"
                          name="location"
                          className={`w-full px-4 py-3 border ${
                            errors.location
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                          placeholder="City, State"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                        {errors.location && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.location}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-amber-100 rounded-md">
                              <GraduationCap className="w-4 h-4 text-amber-600" />
                            </div>
                            Highest Education
                          </div>
                        </label>
                        <select
                          name="education"
                          className={`w-full px-4 py-3 border ${
                            errors.education
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-no-repeat bg-right`}
                          style={{
                            backgroundImage:
                              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02IDcuNUwwIDEuNUwxLjUgMEw2IDQuNUwxMC41IDBMMTIgMS41TDYgNy41WiIgZmlsbD0iIzY0NzQ4QiIvPgo8L3N2Zz4K')",
                            backgroundPosition: "calc(100% - 1rem) center",
                            paddingRight: "2.5rem",
                          }}
                          value={formData.education}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Education Level</option>
                          <option value="High School">High School</option>
                          <option value="Associate's Degree">
                            Associate's Degree
                          </option>
                          <option value="Bachelor's Degree">
                            Bachelor's Degree
                          </option>
                          <option value="Master's Degree">
                            Master's Degree
                          </option>
                          <option value="Doctorate">Doctorate</option>
                        </select>
                        {errors.education && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.education}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-md">
                              <Briefcase className="w-4 h-4 text-blue-600" />
                            </div>
                            Current Title
                          </div>
                        </label>
                        <input
                          type="text"
                          name="currentTitle"
                          className={`w-full px-4 py-3 border ${
                            errors.currentTitle
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                          placeholder="Software Engineer"
                          value={formData.currentTitle}
                          onChange={handleInputChange}
                        />
                        {errors.currentTitle && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.currentTitle}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-md">
                              <Briefcase className="w-4 h-4 text-blue-600" />
                            </div>
                            Years of Experience
                          </div>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="experience"
                            min="0"
                            className={`w-full px-4 py-3 border ${
                              errors.experience
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            placeholder="5"
                            value={formData.experience}
                            onChange={handleInputChange}
                          />
                          {errors.experience && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.experience}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-red-100 rounded-md">
                              <DollarSign className="w-4 h-4 text-red-600" />
                            </div>
                            Expected Salary
                          </div>
                        </label>
                        <div className="relative">
                          {/* <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span> */}
                          <input
                            type="text"
                            name="expectedSalary"
                            className={`w-full pl-4  py-3 border ${
                              errors.expectedSalary
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                            placeholder="$ 80000"
                            value={formData.expectedSalary}
                            onChange={handleInputChange}
                          />
                          {errors.expectedSalary && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.expectedSalary}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-5">
                        <div
                          className={`border-2 border-dashed rounded-xl p-6 transition-all ${
                            selectedResume
                              ? "border-blue-400 bg-blue-50"
                              : errors.resume
                              ? "border-red-400 bg-red-50"
                              : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                          } group`}
                        >
                          <input
                            type="file"
                            id="resume"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "resume")}
                          />
                          <label
                            htmlFor="resume"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <div
                              className={`p-4 rounded-xl mb-3 transition-all ${
                                selectedResume
                                  ? "bg-blue-200"
                                  : errors.resume
                                  ? "bg-red-200"
                                  : "bg-blue-100 group-hover:bg-blue-200"
                              }`}
                            >
                              {selectedResume ? (
                                <FileText className="w-10 h-10 text-blue-600" />
                              ) : (
                                <Upload className="w-10 h-10 text-blue-600" />
                              )}
                            </div>
                            <span className="text-base font-medium text-gray-800">
                              {selectedResume
                                ? selectedResume.name
                                : "Upload your resume"}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              PDF, DOC, DOCX up to 5MB
                            </span>
                            {selectedResume && (
                              <span className="mt-2 text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                                File selected
                              </span>
                            )}
                            {errors.resume && (
                              <span className="mt-2 text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full font-medium flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.resume}
                              </span>
                            )}
                          </label>
                        </div>

                        {/* Cover Letter Upload (same as before but without validation) */}
                        <div
                          className={`border-2 border-dashed rounded-xl p-6 transition-all ${
                            selectedCoverLetter
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                          } group`}
                        >
                          <input
                            type="file"
                            id="coverLetter"
                            name="coverLetter"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "coverLetter")}
                          />
                          <label
                            htmlFor="coverLetter"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <div
                              className={`p-4 rounded-xl mb-3 transition-all ${
                                selectedCoverLetter
                                  ? "bg-blue-200"
                                  : "bg-blue-100 group-hover:bg-blue-200"
                              }`}
                            >
                              {selectedCoverLetter ? (
                                <FileText className="w-10 h-10 text-blue-600" />
                              ) : (
                                <Upload className="w-10 h-10 text-blue-600" />
                              )}
                            </div>
                            <span className="text-base font-medium text-gray-800">
                              {selectedCoverLetter
                                ? selectedCoverLetter.name
                                : "Upload your cover letter (Optional)"}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              PDF, DOC, DOCX up to 5MB
                            </span>
                            {selectedCoverLetter && (
                              <span className="mt-2 text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                                File selected
                              </span>
                            )}
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Actions */}
                <div className="bg-white border-t border-gray-100 pt-4">
                  <div className="flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        step === 1
                          ? "invisible"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      Back
                    </button>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            nextStep();
                          }}
                          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </div>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
