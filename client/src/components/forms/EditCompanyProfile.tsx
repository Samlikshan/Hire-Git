import React, { useRef, useState } from "react";
import { X, Upload } from "lucide-react";

import { updateCompanyProfileServices } from "@/services/company";
import { toast } from "sonner";

interface EditCompanyFormProps {
  company: {
    name?: string;
    description?: string;
    industry?: string;
    companySize?: number;
    founded?: string;
    website?: string;
    headquarters?: string;
    linkedIn?: string;
    twitter?: string;
    about?: string;
    logo?: string | Blob;
  };
  onClose: () => void;
  onSave: (data: {
    name?: string;
    description?: string;
    industry?: string;
    companySize?: number;
    founded?: string;
    website?: string;
    headquarters?: string;
    linkedIn?: string;
    twitter?: string;
    about?: string;
    logo?: string | Blob;
  }) => void;
}

interface FormErrors {
  name?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  founded?: string;
  website?: string;
  headquarters?: string;
  linkedIn?: string;
  twitter?: string;
  about?: string;
  logo?: string;
}

export function EditCompanyForm({
  company,
  onClose,
  onSave,
}: EditCompanyFormProps) {
  const [formData, setFormData] = useState(company);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.name?.trim()) newErrors.name = "Company name is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.industry?.trim()) newErrors.industry = "Industry is required";
    if (!formData.companySize?.toString().trim())
      newErrors.companySize = "Company size is required";
    if (isNaN(formData.companySize!)) {
      newErrors.companySize = "Company size must be in number";
    }
    // Validate year format
    if (formData.founded) {
      const yearRegex = /^\d{4}$/;
      if (!yearRegex.test(formData.founded)) {
        newErrors.founded = "Please enter a valid year (YYYY)";
      } else {
        const currentYear = new Date().getFullYear();
        const foundedYear = parseInt(formData.founded);
        if (foundedYear < 1800 || foundedYear > currentYear) {
          newErrors.founded = `Year must be between 1800 and ${currentYear}`;
        }
      }
    }

    // Validate URLs if provided
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }
    if (formData.linkedIn && !isValidUrl(formData.linkedIn)) {
      newErrors.linkedIn = "Please enter a valid LinkedIn URL";
    }
    if (formData.twitter && !isValidUrl(formData.twitter)) {
      newErrors.twitter = "Please enter a valid Twitter URL";
    }

    // Validate about length
    if (formData.about && formData.about.length > 2000) {
      newErrors.about = "About section must be less than 2000 characters";
    }

    // Validate logo if it's a new file
    if (logoFile) {
      if (logoFile.size > 2 * 1024 * 1024) {
        // 2MB
        newErrors.logo = "Logo must be less than 2MB";
      }
      if (!logoFile.type.match("image.*")) {
        newErrors.logo = "Logo must be an image file";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "logo") {
          formDataToSubmit.append(key, value as string);
        }
      });

      if (logoFile) {
        formDataToSubmit.append("logo", logoFile);
      } else if (formData.logo) {
        formDataToSubmit.append("logo", formData.logo);
      }

      const response = await updateCompanyProfileServices(formDataToSubmit);

      if (response.status === 200 || response.status === 201) {
        toast.success("Profile updated successfully");
        onSave({ ...formData, logo: response.data.logo });
        onClose();
      }
    } catch (err) {
      console.error("Error updating company:", err);
      toast.error("Failed to update company profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file before setting it
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, logo: "Logo must be less than 2MB" }));
        return;
      }
      if (!file.type.match("image.*")) {
        setErrors((prev) => ({ ...prev, logo: "Logo must be an image file" }));
        return;
      }

      setLogoFile(file);
      setErrors((prev) => ({ ...prev, logo: undefined }));

      const previewURL = URL.createObjectURL(file);
      setLogoPreview(previewURL);
    }
  };

  return (
    <div
      className="fixed inset-0 flex backdrop-blur-[1px] items-center justify-center p-4 bg-opacity-90"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Edit Company Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Logo Upload */}
          <div className="flex justify-center">
            <div
              className="relative group cursor-pointer"
              onClick={handleLogoClick}
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="New company logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={
                      formData.logo
                        ? `${import.meta.env.VITE_S3_PATH}/${formData.logo}`
                        : ""
                    }
                    alt="Company logo"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <Upload size={24} className="mx-auto mb-2" />
                  <span className="text-sm">Update Logo</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {errors.logo && (
            <p className="text-red-500 text-sm text-center">{errors.logo}</p>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.industry ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.companySize ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.companySize && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companySize}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Founded Year
                </label>
                <input
                  type="text"
                  name="founded"
                  value={formData.founded}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.founded ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="YYYY"
                />
                {errors.founded && (
                  <p className="text-red-500 text-sm mt-1">{errors.founded}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.website ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headquarters
              </label>
              <input
                type="text"
                name="headquarters"
                value={formData.headquarters}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.linkedIn ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://linkedin.com/company/example"
                />
                {errors.linkedIn && (
                  <p className="text-red-500 text-sm mt-1">{errors.linkedIn}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter URL
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.twitter ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://twitter.com/example"
                />
                {errors.twitter && (
                  <p className="text-red-500 text-sm mt-1">{errors.twitter}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border ${
                  errors.about ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.about && (
                <p className="text-red-500 text-sm mt-1">{errors.about}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.about?.length || 0}/2000 characters
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
