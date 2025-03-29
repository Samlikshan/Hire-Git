import { useState, FormEvent, ChangeEvent } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { companyLoginservice } from "@/services/auth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login } from "@/reducers/userSlice";

interface LoginData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function CompanyLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleLoginChange =
    (field: keyof LoginData) => (e: ChangeEvent<HTMLInputElement>) => {
      setLoginData((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!loginData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginData.email))
      newErrors.email = "Invalid email format";
    if (!loginData.password) newErrors.password = "Password is required";
    else if (loginData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await companyLoginservice(
        loginData.email,
        loginData.password
      );

      if (response.status == 200) {
        toast.success("Login Successfull");
        setTimeout(() => {
          dispatch(login({ ...response.data.user, role: "company" }));
          navigate("/company");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      setErrors({ general: "Login failed. Please try again." });
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-white-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            {success}
          </div>
        )}

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginChange("email")}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange("password")}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                onClick={() => navigate("/company-forgot-password")}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a
            onClick={() => navigate("/company-register")}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
