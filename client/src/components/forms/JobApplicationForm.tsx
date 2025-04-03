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
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";

interface JobApplicationFormProps {
  jobTitle: string;
  company: string;
  companyLogo: string; // URL to the company logo
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
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

  const [step, setStep] = useState(1);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const newformData = new FormData(form);

    for (const value of Object.entries(formData)) {
      newformData.append(value[0], value[1]);
    }
    // if (selectedResume) {
    //   newformData.append("resume", selectedResume);
    // }
    // if (selectedCoverLetter) {
    //   newformData.append("coverLetter", selectedCoverLetter);
    // }
    if (user?._id) {
      newformData.append("candidate", user?._id);
    }

    try {
      await onSubmit(newformData);
    } catch (error) {
      console.error("Error submitting application:", error);
      return;
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
      if (type === "resume") {
        setSelectedResume(file);
      } else {
        setSelectedCoverLetter(file);
      }
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
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

            {/* Form */}
            <div className="p-8">
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="john.doe@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="(555) 555-5555"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="City, State"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-no-repeat bg-right bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02IDcuNUwwIDEuNUwxLjUgMEw2IDQuNUwxMC41IDBMMTIgMS41TDYgNy41WiIgZmlsbD0iIzY0NzQ4QiIvPgo8L3N2Zz4K')]"
                          style={{
                            backgroundPosition: "calc(100% - 1rem) center",
                            paddingRight: "2.5rem",
                          }}
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="Software Engineer"
                          value={formData.currentTitle}
                          onChange={handleInputChange}
                        />
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="5"
                            value={formData.experience}
                            onChange={handleInputChange}
                          />
                          {/* <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            years
                          </span> */}
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
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            name="expectedSalary"
                            className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="80000"
                            value={formData.expectedSalary}
                            onChange={handleInputChange}
                          />
                          {/* <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            per year
                          </span> */}
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
                          </label>
                        </div>

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
                <div className="mt-8 flex justify-between gap-3">
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
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
