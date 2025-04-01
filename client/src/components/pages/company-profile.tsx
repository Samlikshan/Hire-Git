import { useState } from "react";
import {
  Building2,
  Users,
  Calendar,
  Globe2,
  MapPin,
  Link as LinkIcon,
  Edit,
  Plus,
} from "lucide-react";
import { EditCompanyForm } from "../forms/EditCompanyProfile";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { updateUserData } from "@/reducers/userSlice";

interface Company {
  _id: string;
  name: string;
  email: string;
  socialLinks: { linkedIn?: string; twitter?: string };

  isVerified: boolean;
  accountStatus: {
    status: "Pending" | "Rejected" | "Accepted";
    description: string;
  };
  website: string;
  industry: string;
  description: string;
  companySize: string;
  founded: string;
  about: string;
  headquarters: string;
  logo: string;
}

export default function CompanyProfile() {
  const company = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = (updatedData: Company) => {
    dispatch(updateUserData({ ...updatedData }));
    setIsEditModalOpen(false);
  };

  const hasBasicInfo =
    company?.name && company.headquarters && company.industry;

  const hasDetailedInfo =
    company?.description ||
    company?.companySize ||
    company?.founded ||
    company?.website ||
    company?.socialLinks?.linkedIn ||
    company?.socialLinks?.twitter;
  const hasAbout = company?.about;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-6">
              {company?.logo ? (
                <img
                  src={`${import.meta.env.VITE_S3_PATH}/${company?.logo}`}
                  alt="Company Logo"
                  className="w-24 h-24 rounded-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Plus size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{company?.name}</h1>
                {company?.description ? (
                  <p className="text-gray-600 text-lg">
                    {company?.description}
                  </p>
                ) : (
                  <p className="text-gray-400 text-lg italic">
                    Add a company description
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Edit size={18} />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="flex gap-4">
            {company?.industry && (
              <div className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                {company?.industry}
              </div>
            )}
            {company?.companySize && (
              <div className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                {company.companySize}
              </div>
            )}
            {company?.founded && (
              <div className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                Founded {company?.founded}
              </div>
            )}
          </div>
        </div>

        {/* Stats - Only show if company has detailed info */}
        {/* {hasDetailedInfo && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 mb-2">Open Positions</h3>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">127</p>
                <span className="text-sm text-green-500 mb-1">+12%</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 mb-2">Total Applications</h3>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">1,438</p>
                <span className="text-sm text-green-500 mb-1">+8%</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 mb-2">Hired This Month</h3>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">24</p>
                <span className="text-sm text-red-500 mb-1">-3%</span>
              </div>
            </div>
          </div>
        )} */}

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Company Details</h2>
            {!hasDetailedInfo && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Complete profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <Building2 className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Industry</p>
                  <p className="font-medium">{company?.industry}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Company Size</p>
                  {company?.companySize ? (
                    <p className="font-medium">{company?.companySize}</p>
                  ) : (
                    <p className="text-gray-400 italic">Add company size</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Founded</p>
                  {company?.founded ? (
                    <p className="font-medium">{company?.founded}</p>
                  ) : (
                    <p className="text-gray-400 italic">Add founding year</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <Globe2 className="text-orange-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Website</p>
                  {company?.website ? (
                    <a
                      href={`https://${company.website}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {company?.website}
                    </a>
                  ) : (
                    <p className="text-gray-400 italic">Add website URL</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <MapPin className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Headquarters</p>
                  <p className="font-medium">{company?.headquarters}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-teal-50 p-3 rounded-lg">
                  <LinkIcon className="text-teal-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Social Media</p>
                  {company?.socialLinks?.linkedIn ||
                  company?.socialLinks?.twitter ? (
                    <div className="flex gap-2">
                      {company?.socialLinks?.linkedIn && (
                        <a
                          href={company.socialLinks?.linkedIn}
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn
                        </a>
                      )}
                      {company?.socialLinks?.linkedIn &&
                        company?.socialLinks?.twitter && (
                          <span className="text-gray-300">•</span>
                        )}
                      {company?.socialLinks?.twitter && (
                        <a
                          href={company?.socialLinks?.twitter}
                          className="text-blue-600 hover:underline"
                        >
                          Twitter
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      Add social media links
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {hasAbout ? (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                About {company.name}
              </h3>
              {company.about.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-gray-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="mt-8 p-6 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500">
                Add information about your company
              </p>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Add company description
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditModalOpen && (
        <EditCompanyForm
          company={company}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
