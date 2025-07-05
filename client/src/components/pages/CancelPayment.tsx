import { cancelPaymentService } from "@/services/subscription";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CancelPayment: React.FC = () => {
  const history = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const cancelPaymentSession = async () => {
      try {
        if (!sessionId) throw new Error("Invalid Session Id");
        const response = await cancelPaymentService(sessionId);
        if (response.status == 200) {
          toast.info("Payment Cancelled");
          history("/company/subscriptions");
        }
      } catch (error) {
        console.log("Cancelling payment session failed", error);
      }
    };
    cancelPaymentSession();
  }, [history, sessionId]);

  return (
    <div>
      <h2>Processing your payment...</h2>
    </div>
  );
};

export default CancelPayment;
