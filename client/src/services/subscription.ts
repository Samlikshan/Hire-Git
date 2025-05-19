import { Plan } from "@/types/Plan";
import axiosInstance from "./axiosInstance";

export const listSubscriptionsService = async () => {
  return await axiosInstance.get("/admin/subscriptions");
};

export const createPlanService = async (newPlan: Partial<Plan>) => {
  return await axiosInstance.post("/admin/subscription", newPlan);
};
export const updatePlanService = async (
  planId: string,
  updatedPlan: Partial<Plan>
) => {
  return await axiosInstance.patch("/admin/subscription", {
    planId,
    updatedPlan,
  });
};

export const deletePlanService = async (planId: string) => {
  return await axiosInstance.delete(`/admin/subscription/${planId}`);
};

export const handlePayment = async (priceId: string) => {
  try {
    const response = await axiosInstance.post("/payments/create-session", {
      priceId,
    });
    const { url } = response.data;
    window.location.href = url;
  } catch (err) {
    console.error("Payment failed:", err);
  }
};

export const getMySubscriptionsService = async () => {
  return await axiosInstance.get("/payments/my-subscriptions");
};

export const getSubscriptionHistoryService = async (timeRange: string) => {
  return await axiosInstance.get(
    `/admin/subscription/dasbaord?filterBy=${timeRange}`
  );
};
