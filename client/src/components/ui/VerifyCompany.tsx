import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { verifyCompanyService } from "@/services/auth";

export default function VerifyCompanyAccount() {
  const [status, setStatus] = useState("success"); // Change to "failed" to test failure state
  const params = useParams<{ token: string }>();
  const token = params.token;
  // const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true; // Track whether the component is still mounted

    const handleVerifyEmail = async () => {
      try {
        if (token) {
          const response = await verifyCompanyService(token);
          if (isMounted) {
            if (response.status === 200) {
              setStatus("success");
            } else {
              setStatus("failed");
            }
          }
        }
      } catch (error) {
        console.log(error);
        if (isMounted) setStatus("failed");
      }
    };

    handleVerifyEmail();

    return () => {
      isMounted = false; // Cleanup when the component is unmounted
    };
  }, [token]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-[400px] p-8 text-center shadow-lg">
        <CardHeader>
          {status === "success" ? (
            <MailCheck className="mx-auto h-20 w-20 text-green-500" />
          ) : (
            <XCircle className="mx-auto h-20 w-20 text-red-500" />
          )}
          <CardTitle className="mt-4 text-2xl font-semibold">
            {status === "success" ? "Email Verified" : "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            {status === "success"
              ? "Your email has been successfully verified. You can now access all features."
              : "The verification link is invalid or expired. Please request a new one."}
          </p>
          <Button
            className="mt-6 w-full"
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Go to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
