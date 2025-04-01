import { useSelector } from "react-redux";
import CompanyVerificationStatus from "../ui/company-status";
import { RootState } from "@/reducers/rootReducer";
function CompanyStatus() {
  const { accountStatus } = useSelector(
    (state: RootState) => state.user.userData
  );
  return (
    <div className="min-h-screen">
      <CompanyVerificationStatus
        status={accountStatus.status}
        rejectionReason={accountStatus.description}
      />
    </div>
  );
}

export default CompanyStatus;
