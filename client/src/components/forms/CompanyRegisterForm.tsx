import { companyRegisterSerivce } from "@/services/auth";
import { useState, FormEvent, ChangeEvent } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormData {
  companyName: string;
  email: string;
  contactNumber: string;
  headquarters: string;
  industry: string;
  registrationDocument: File | null;
  password: string;
}

interface FormErrors {
  companyName?: string;
  email?: string;
  contactNumber?: string;
  headquarters?: string;
  industry?: string;
  registrationDocument?: string;
  password?: string;
  general?: string;
}

export default function CompanyRegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    email: "",
    contactNumber: "",
    headquarters: "",
    industry: "",
    registrationDocument: null,
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const industries: string[] = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Other",
  ];

  const handleInputChange =
    (field: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, registrationDocument: file }));
    setErrors((prev) => ({ ...prev, registrationDocument: "" }));
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.companyName)
      newErrors.companyName = "Company name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    if (!formData.headquarters)
      newErrors.headquarters = "Headquarters address is required";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (!formData.registrationDocument)
      newErrors.registrationDocument = "Registration document is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await companyRegisterSerivce(formData);
      if (response.status !== 200) throw new Error("Failed to register");

      setErrors({});
      setSuccess(response.data.message);
      setFormData({
        companyName: "",
        email: "",
        contactNumber: "",
        headquarters: "",
        industry: "",
        registrationDocument: null,
        password: "",
      });
      setIsLoading(false);

      // setEmailSent(true);
    } catch (err: unknown) {
      console.log(err, "error");
      // Type error as unknown and handle it
      const errorMessage =
        err instanceof Error ? err.message : "Error occurred";
      setErrors({ general: errorMessage });
      setIsLoading(false);

      setSuccess("");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 to-white-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl flex overflow-hidden">
        {/* Left Side: Form */}
        <div className="w-full lg:w-3/5 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-3 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Register Your Company
            </h2>
            <p className="text-gray-600 mt-1">Create your business account</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              {success}
            </div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Details Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={handleInputChange("companyName")}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.companyName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                      placeholder="Enter company name"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={handleInputChange("contactNumber")}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.contactNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                      placeholder="Enter contact number"
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headquarters Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.headquarters}
                      onChange={handleInputChange("headquarters")}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.headquarters
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                      placeholder="Enter Headquarters address"
                    />
                  </div>
                  {errors.headquarters && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.headquarters}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.industry}
                      onChange={handleInputChange("industry")}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.industry ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white`}
                    >
                      <option value="">Select industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.industry && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.industry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange("password")}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                      placeholder="Enter password"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Document
              </label>
              <div className="relative">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.registrationDocument
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent
                    file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                    file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100`}
                  />
                </div>
              </div>
              {errors.registrationDocument && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.registrationDocument}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Register Company"
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => navigate("/company-login")}
              >
                Sign in
              </button>
            </p>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="hidden lg:block w-2/5 relative">
          <div className="absolute inset-0 "></div>
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            alt="Office building"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
