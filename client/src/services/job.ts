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

export const getJobDetailsService = async (jobId: string) => {
  const response = await axiosInstance.get(`/company/job/${jobId}`);
  return response;
};

export const updateJobService = async (jobsData: Job) => {
  const response = await axiosInstance.put("/company/job", jobsData);
  return response;
};

export const deleteJobPostService = async (jobId: string) => {
  const response = await axiosInstance.delete(`/company/job/${jobId}`);
  return response;
};
