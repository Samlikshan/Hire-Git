import { logout } from "@/reducers/userSlice";
import { store } from "@/store/store";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      try {
        await axiosInstance.get("/auth/refresh-token");
        return axiosInstance(error.config);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return handleApiError(error);
  }
);

export default axiosInstance;

const handleApiError = (error: AxiosError) => {
  let message = "Something went wrong!";

  if (error.response) {
    message = (error.response.data as { message?: string })?.message || message;
  } else if (error.request) {
    message = "No response from server. Please try again.";
  } else {
    message = error.message;
  }

  toast.error(message);
  return Promise.reject(error);
};
