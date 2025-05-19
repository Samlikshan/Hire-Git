import axiosInstance from "./axiosInstance";

export const updateCompanyProfileServices = async (profileData) => {
  const response = await axiosInstance.post(
    "/company/update-profile",
    profileData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
};

// services/company.ts
export const getDashboardService = async (filters: {
  page?: number;
  status?: string;
  timeframe?: string;
}) => {
  const response = await axiosInstance.get("/company/dashboard", {
    params: filters,
  });
  return response;
};
