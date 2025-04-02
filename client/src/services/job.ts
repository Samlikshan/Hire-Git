import { Job } from "@/types/job";
import axiosInstance from "./axiosInstance";

export const listCompanyJobsService = async (companyId: string) => {
  const response = await axiosInstance.get(`/company/jobs/${companyId}`);
  return response;
};

export const createJobPostService = async (jobData: Job) => {
  const response = await axiosInstance.post("/company/job", jobData);
  return response;
};
