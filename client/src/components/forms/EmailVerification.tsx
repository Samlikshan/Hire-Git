import { useNavigate, useParams } from "react-router-dom";
import { verifyEmailService } from "../../services/auth";
// import { toast } from "sonner";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

function EmailVerification() {
  const params = useParams();
  const navigate = useNavigate();
  // let verificationStatus = null;
  const [verificationStatus, seVerificationStatus] = useState("");

  const handleVerifyEmail = async () => {
    try {
      if (params.token) {
        const response = await verifyEmailService(params.token);
        console.log(response);
        if (response.status === 200) {
          seVerificationStatus("success");
          // toast.success("Email verified successfully");
          setTimeout(() => {
            navigate("/login");
          }, 2500);
        } else {
          seVerificationStatus("error");
          // toast(response.data.error);
          setTimeout(() => {
            navigate("/login");
          }, 2500);
        }
      }
    } catch (error) {
      console.log(error);
      seVerificationStatus("error");
      // toast("Oops something went wrong");
    }
  };

  useEffect(() => {
    handleVerifyEmail();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {verificationStatus === "success" ? (
          <>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Email Verified Successfully!
              </h2>

              <p className="text-gray-600 mb-8">
                Your email has been verified. You can now access all features of
                your account.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl
                  hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
                  shadow-lg hover:shadow-xl"
              >
                Continue to Login
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Verification Failed
              </h2>

              <p className="text-gray-600 mb-8">
                We couldn't verify your email address. The link might be expired
                or invalid.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/resend-verification")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl
                    hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 
                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
                    shadow-lg hover:shadow-xl"
                >
                  Resend Verification Email
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-white text-gray-700 font-medium py-3 px-4 rounded-xl border border-gray-200
                    hover:bg-gray-50 transform transition-all duration-200 
                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Return to Login
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailVerification;
