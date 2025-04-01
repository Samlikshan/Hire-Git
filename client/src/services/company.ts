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
