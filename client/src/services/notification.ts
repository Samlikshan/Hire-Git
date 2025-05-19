import axiosInstance from "./axiosInstance";

export const getUnreadNotificationsService = async (candidateId: string) => {
  const response = await axiosInstance.get(
    `/candidate/unread-notifications/${candidateId}`
  );
  return response;
};
export const getNotificationsService = async (candidateId: string) => {
  const response = await axiosInstance.get(
    `/candidate/notifications/${candidateId}`
  );
  return response;
};

export const markAsReadService = async (notificationId: string) => {
  const response = await axiosInstance.patch(
    `/candidate/notifications/${notificationId}/read`
  );
  return response.data;
};

export const markAllAsReadService = async (userId: string) => {
  const response = await axiosInstance.patch(
    `/candidate/notifications/mark-all-as-read/${userId}`
  );
  return response.data;
};
