import axiosInstance from "./axiosInstance";

export const listJobInterviewService = async (jobId: string) => {
  const response = await axiosInstance.get(
    `/interview/list-interviews/${jobId}`
  );
  return response;
};

export const evaluateCandidateService = async (evaluation: {
  completedAt: Date;
  notes: string;
  ratings: { communication: number; technical: number; cultureFit: number };
  recommendation: string;
  roomID: string;
}) => {
  const response = await axiosInstance.put(
    "/interview/evaluate-candidate",
    evaluation
  );
  return response;
};

export const inProgressService = async (jobId: string) => {
  const response = await axiosInstance.get(`/interview/in-progress/${jobId}`);
  return response;
};

export const hireService = async (
  offerLetter: FormData,
  interviewId: string
) => {
  const response = await axiosInstance.post(
    `/interview/${interviewId}/hire`,
    offerLetter
  );
  return response;
};
export const rejectService = async (
  interviewId: string,
  rejectionReason: string
) => {
  const response = await axiosInstance.post(
    `/interview/${interviewId}/reject`,
    {
      rejectionReason,
    }
  );
  return response;
};

export const acceptOfferService = async (
  interviewId: string,
  signedOfferLetter: FormData
) => {
  const response = await axiosInstance.post(
    `/interview/${interviewId}/accept-offer`,
    signedOfferLetter
  );
  return response;
};

export const rejectOfferService = async (
  interviewId: string,
  rejectionReason: string
) => {
  const response = await axiosInstance.post(
    `/interview/${interviewId}/reject-offer`,
    {
      rejectionReason,
    }
  );
  return response;
};

export const validateRoomAccessService = async (roomId: string) => {
  const resposne = await axiosInstance.get(`/interview/validate/${roomId}`);
  return resposne;
};
