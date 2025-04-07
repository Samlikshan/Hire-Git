import axiosInstance from "./axiosInstance";

export const getNotificationsService = async (candidateId: string) => {
  const response = await axiosInstance.get(
    `/candidate/notifications/${candidateId}`
  );
  return response;
};
