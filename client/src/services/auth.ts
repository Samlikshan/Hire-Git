import axios, { AxiosResponse, isAxiosError } from "axios";
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

interface FormData {
  companyName: string;
  email: string;
  contactNumber: string;
  headquarters: string;
  industry: string;
  registrationDocument: File | null; // File type for the uploaded document
  password: string;
}

export const companyRegisterSerivce = async (data: FormData) => {
  const form = new FormData();
  if (data.headquarters) form.append("headquarters", data.headquarters);
  form.append("companyName", data.companyName);
  if (data.email) form.append("email", data.email);
  if (data.contactNumber) form.append("contactNumber", data.contactNumber);
  if (data.password) form.append("password", data.password);
  if (data.industry) form.append("industry", data.industry);
  if (data.registrationDocument)
    form.append("registrationDocument", data.registrationDocument);
  try {
    const response = await axios.post(`${apiURL}/auth/register/company`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response;
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

export const verifyCompanyService = async (token: string) => {
  try {
    const response = await apiClient.post(
      `${apiURL}/auth/verify/company`,
      { token },
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

export const companyLoginservice = async (
  email: string,
  password: string
): Promise<AxiosResponse> => {
  try {
    const response = await apiClient.post(`${apiURL}/auth/login/company`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const sendResetPasswordCompany = async (email: string) => {
  try {
    const response = await apiClient.post(
      `${apiURL}/auth/company/generate-reset-password`,
      { email }
    );
    return response;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const companyResetPassword = async (
  token: string,
  newPassword: string
) => {
  try {
    const response = await apiClient.post(
      `${apiURL}/auth/company/reset-password`,
      {
        token,
        newPassword,
      }
    );

    return response;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const registerService = async (
  name: string,
  email: string,
  password: string
): Promise<AxiosResponse> => {
  try {
    const response = await apiClient.post(`${apiURL}/auth/register/candidate`, {
      name,
      email,
      password,
    });
    return response;
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

export const verifyEmailService = async (
  token: string
): Promise<AxiosResponse> => {
  try {
    const response = await apiClient.post(
      `${apiURL}/auth/verify-email/candidate`,
      {
        token,
      }
    );
    return response;
  } catch (error: unknown) {
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
