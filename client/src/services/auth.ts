import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

const apiURL: string =
  import.meta.env.VITE_SERVER_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

const handleAxiosError = (error: unknown) => {
  if (isAxiosError(error) && error.response) {
    const message =
      (error.response.data as { message?: string })?.message ||
      "An error occurred!";
    toast.error(message);
  } else {
    toast.error("An unexpected error occurred");
  }
  return Promise.reject(error);
};

export const adminLoginService = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(`${apiURL}/auth/admin/login`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const logoutService = async () => {
  try {
    await apiClient.get(`${apiURL}/auth/logout`, { withCredentials: true });
  } catch (error) {
    return handleAxiosError(error);
  }
};
