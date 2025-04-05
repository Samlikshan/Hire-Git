import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
const apiURL: string = import.meta.env.VITE_SERVER_URL;

export const updateProfileService = async (
  formData
): Promise<AxiosResponse> => {
  const response = await axiosInstance.put(
    `${apiURL}/candidate/profile`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const addExperienceService = async (experience: {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}) => {
  const response = await axiosInstance.put(
    "/candidate/experience",
    experience
  );
  return response;
};
