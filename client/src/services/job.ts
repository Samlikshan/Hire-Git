
import { CandidateJob, Job } from "@/types/job";
import axiosInstance from "./axiosInstance";
// Updated job service
export const listCompanyJobsService = async (
  companyId: string,
  page: number,
  limit: number,
  filters: {
    status?: string;
    department?: string[];
    location?: string[];
    type?: string[];
    experience?: string[];
  },
  search?: string
) => {
  const params = {
    page,
    limit,
    status: filters.status,
    department: filters.department?.join(","),
    location: filters.location?.join(","),
    type: filters.type?.join(","),
    experience: filters.experience?.join(","),
    search,
  };

  const response = await axiosInstance.get(`/company/jobs/${companyId}`, {
    params,
  });
  return response.data;
};
// export const listCompanyJobsService = async (companyId: string) => {
//   const response = await axiosInstance.get(`/company/jobs/${companyId}`);
//   return response;
// };

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

export const getJobApplicantsService = async (jobId: string) => {
  const response = await axiosInstance.get(`/company/job/applicants/${jobId}`);
  return response;
};

export const shortListCandidateService = async (applicationId: string) => {
  const response = await axiosInstance.patch(
    `/company/job/shortlist/${applicationId}`
  );
  return response;
};

export const getAppliedJobsService = async (candiddateId: string) => {
  const response = await axiosInstance.get(
    `/interview/job-history/${candiddateId}`
  );
  return response;
};

export const saveJobService = async (jobId: string) => {
  const response = await axiosInstance.post(`/candidate/save-job/${jobId}`);
  return response;
};
export const listSavedJobsService = async () => {
  const response = await axiosInstance.get("/candidate/saved-jobs");
  return response;
};

export const scheduleInterviewService = async (data: {
  applicationId: string;
  date: string;
  time: string;
  duration: string;
  timeZone: string;
  round: string;
  notes: string;
}) => {
  const response = await axiosInstance.post(
    "/company/job/schedule-interview",
    data
  );
  return response;
};
