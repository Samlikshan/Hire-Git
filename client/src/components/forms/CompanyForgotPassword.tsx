import { useState, FormEvent } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { sendResetPasswordCompany } from "@/services/auth";

export default function CompanyForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Track success state

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await sendResetPasswordCompany(email);
      if (response.status == 200) {
        setIsSuccess(true);
        toast.success("Reset link sent successfully");
      }
    } catch (error) {
      console.error(error);
      // setError("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-white-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-600 p-3 rounded-full mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Check Your Email
            </h2>
            <p className="text-gray-600 mt-4">
              We've sent a password reset link to:
              <br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              Click the link in the email to reset your password. If you don't
              see the email, check your spam folder.
            </p>
          </div>

          <button
            onClick={() => navigate("/company-login")}
            className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Login
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Didn't receive the email?{" "}
            <a
              onClick={() => navigate("/forgot-password")}
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              Try again
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-white-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
          <p className="text-gray-600 mt-1 text-center">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                placeholder="Enter your email address"
              />
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
              "Send Reset Link"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <a
            onClick={() => navigate("/company-login")}
            className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
