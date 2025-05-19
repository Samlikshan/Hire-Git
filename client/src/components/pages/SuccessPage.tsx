import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";

const SuccessPage: React.FC = () => {
  const history = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) throw new Error("Invalid session");

        const response = await axiosInstance.get(
          `/payments/verify/${sessionId}`
        );
        console.log(response, "response");
        // return;
        if (response.data.status == "paid") {
          history("/company/subscriptions");
        } else {
          history("/payment-failed");
        }
      } catch (err) {
        console.error("Verification failed:", err);
        history("/error");
      }
    };

    verifyPayment();
  }, [history, sessionId]);

  return (
    <div>
      <h2>Processing your payment...</h2>
    </div>
  );
};

export default SuccessPage;
