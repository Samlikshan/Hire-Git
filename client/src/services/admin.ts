import axiosInstance from "./axiosInstance";

export const listCompaniesService = async (params: {
  page: number;
  limit: number;
  search: string;
}) => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search.toString(),
  });
  const response = await axiosInstance.get(
    `/admin/list-companies?${queryParams}`
  );
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

export const listCandidatesService = async (params: {
  page: number;
  limit: number;
  search: string;
}) => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search.toString(),
  });

  const response = await axiosInstance.get(
    `/admin/list-candidates?${queryParams}`,
    {
      withCredentials: true,
    }
  );
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
