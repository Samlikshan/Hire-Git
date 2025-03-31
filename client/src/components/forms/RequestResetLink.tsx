import { useState } from "react";
import { FloatingInput } from "../ui/Input1";
import { sendResetPasswordLink } from "../../services/auth";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RequestResetLink() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false); // New state to track if email is sent
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      setError("Email is required");
      setIsSubmitting(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    setError("");

    try {
      const response = await sendResetPasswordLink(email);
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsEmailSent(true); // Set email sent state to true
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the "Reset Password Email Sent" confirmation if email is sent
  if (isEmailSent) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Reset Password Email Sent!
            </h2>

            <p className="text-gray-600 mb-8">
              We've sent a password reset link to your email address. Please
              check your inbox and follow the instructions to reset your
              password.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the initial form if email is not sent
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-6 text-sm gap-1 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to login</span>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
          <p className="text-gray-500 text-sm">
            Enter your email address, and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <div className="relative">
              <FloatingInput
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                error={error}
              />
              <Mail
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
