import axiosInstance from "./axiosInstance";

export const listCompaniesService = async () => {
  const response = await axiosInstance.get(`/admin/list-companies`);
  return response;
};

export const reveiwCompanyService = async (
  companyId: string,
  adminId: string,
  action: string,
  description: string
) => {
  const response = await axiosInstance.post(`/admin/review-company`, {
    companyId,
    adminId,
    action,
    description,
  });
  return response;
};

export const listCandidatesService = async () => {
  const response = await axiosInstance.get(`/admin/list-candidates`, {
    withCredentials: true,
  });
  return response;
};

export const blockCandidateService = async (
  candidateId: string,
  status: boolean
) => {
  const response = await axiosInstance.post(`/admin/block-candidates`, {
    candidateId,
    status,
  });
  return response;
};
