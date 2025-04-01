import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const CompanyRoutes = () => {
  const { isAuthenticated, role, userData } = useSelector(
    (state: RootState) => state.user
  );

  if (!isAuthenticated) {
    return <Navigate to="/company-login" replace />;
  }

  if (isAuthenticated && role !== "company") {
    return <Navigate to="/" replace />;
  }

  if (
    (isAuthenticated && userData?.accountStatus.status == "Pending") ||
    userData?.accountStatus.status == "Rejected"
  ) {
    return <Navigate to="/company-status" replace />;
  }
  return <Outlet />;
};

export default CompanyRoutes;
