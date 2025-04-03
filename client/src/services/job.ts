import { CandidateJob, Job } from "@/types/job";
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

export const listCandidateJobsService = async (params: {
  page: number;
  limit: number;
  search?: string;
  types?: string[];
  departments?: string[];
  locations?: string[];
  experience?: string[];
  tags?: string[];
}) => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...(params.search && { search: params.search }),
    ...(params.types && { types: params.types.join(",") }),
    ...(params.departments && { departments: params.departments.join(",") }),
    ...(params.locations && { locations: params.locations.join(",") }),
    ...(params.experience && { experience: params.experience.join(",") }),
    ...(params.tags && { tags: params.tags.join(",") }),
  });

  const response = await axiosInstance.get<{
    jobs: CandidateJob[];
    total: number;
    page: number;
    pages: number;
  }>(`/candidate/jobs?${queryParams}`);
  return response;
};

export const applyJobService = async (data: object, jobId: string) => {
  const response = await axiosInstance.post(
    `/candidate/job/apply/${jobId}`,

    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
};

export const isAppliedJobService = async (
  jobId: string,
  candidateId: string
) => {
  const response = await axiosInstance.get(
    `/candidate/job/applied/${jobId}/${candidateId}`
  );
  return response;
};

export const getRelatedJobsService = async (jobid: string) => {
  const response = await axiosInstance.get(`/candidate/job/related/${jobid}`);
  return response;
};

export const getTrendingJobsService = async () => {
  const response = await axiosInstance.get("/candidate/job/trending");
  return response;
};
