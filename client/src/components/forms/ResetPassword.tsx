import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FloatingInput } from "../ui/Input1";
import { resetPassword } from "../../services/auth";
import { toast } from "sonner";
import { Lock, Check, ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";

export default function ResetPassword() {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = (): { strength: number; message: string } => {
    if (password.length === 0) return { strength: 0, message: "No password" };
    if (password.length < 6) return { strength: 1, message: "Too weak" };
    if (password.length < 8)
      return { strength: 2, message: "Could be stronger" };
    if (!/[A-Z]/.test(password))
      return { strength: 2, message: "Add uppercase letter" };
    if (!/[0-9]/.test(password)) return { strength: 3, message: "Add number" };
    return { strength: 4, message: "Strong password" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.token) {
      setError("Invalid or missing token.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await resetPassword(params.token, password);

      if (response.status == 200) {
        toast.success(response.data.message);
        setSuccess(true);
      } else {
        setError(response.data.error || "Failed to reset password. Try again.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <div className="mb-6 relative">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Password Reset Complete!
          </h2>

          <p className="text-gray-600 mb-8">
            Your password has been successfully updated. You can now log in with
            your new credentials.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl
              hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
              shadow-lg hover:shadow-xl"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const { strength, message } = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <button
          onClick={() => navigate("/login")}
          className="group flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to login</span>
        </button>

        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl rotate-45 transform">
            <Shield className="w-8 h-8 text-white -rotate-45" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create New Password
          </h2>
          <p className="text-gray-500">
            Please ensure your new password is secure and memorable
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="relative">
                <FloatingInput
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                />
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{message}</span>
                    <span className="text-xs text-gray-400">{strength}/4</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength === 0
                          ? "w-0 bg-gray-200"
                          : strength === 1
                          ? "w-1/4 bg-red-500"
                          : strength === 2
                          ? "w-2/4 bg-yellow-500"
                          : strength === 3
                          ? "w-3/4 bg-blue-500"
                          : "w-full bg-green-500"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="relative">
                <FloatingInput
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  Passwords don't match
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl
                hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
                shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-xs text-gray-500 space-y-1.5">
              <p>Password requirements:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>At least 6 characters long</li>
                <li>Include uppercase letter (A-Z)</li>
                <li>Include number (0-9)</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
