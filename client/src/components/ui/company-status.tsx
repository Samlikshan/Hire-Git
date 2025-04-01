import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LogOut, Hourglass, XCircle, CheckCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/reducers/userSlice";

export default function CompanyVerificationStatus({
  status,
  rejectionReason,
}: {
  status: string;
  rejectionReason: string;
}) {
  const dispatch = useDispatch();
  return (
    <div className="w-full max-w-lg mx-auto mt-16 flex flex-col items-center">
      <Card className="w-full p-6 shadow-md border rounded-xl bg-white">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">
            Company Verification
          </CardTitle>
          <p className="text-gray-500 text-sm">
            Your account status will be updated soon.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "Pending" && (
            <Alert className="flex items-center gap-3 p-4 border border-yellow-400 bg-yellow-50 rounded-lg">
              <Hourglass size={24} className="text-yellow-600" />
              <div>
                <AlertTitle className="text-lg font-semibold text-yellow-700">
                  Verification in Progress
                </AlertTitle>
                <AlertDescription className="text-sm text-gray-700">
                  Your account is currently under review. You will be notified
                  once verification is complete.
                </AlertDescription>
              </div>
            </Alert>
          )}

          {status === "Rejected" && (
            <Alert className="flex items-center gap-3 p-4 border border-orange-500 bg-orange-50 rounded-lg">
              <XCircle size={24} className="text-orange-600" />
              <div>
                <AlertTitle className="text-lg font-semibold text-orange-700">
                  Account Rejected
                </AlertTitle>
                <AlertDescription className="text-sm text-gray-700">
                  Unfortunately, your account has been rejected for the
                  following reason:
                  <span className="block mt-2 font-semibold text-orange-600">
                    {rejectionReason}
                  </span>
                </AlertDescription>
              </div>
            </Alert>
          )}

          {status === "Accepted" && (
            <Alert className="flex items-center gap-3 p-4 border border-green-500 bg-green-50 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
              <div>
                <AlertTitle className="text-lg font-semibold text-green-700">
                  Verification Successful
                </AlertTitle>
                <AlertDescription className="text-sm text-gray-700">
                  Your company account has been successfully verified. You can
                  now access all features.
                </AlertDescription>
              </div>
            </Alert>
          )}

          <div className="mt-6 flex justify-center">
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => dispatch(logout())}
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
