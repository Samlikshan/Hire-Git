import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const CompanyStatusRoutes = () => {
  const { isAuthenticated, role, userData } = useSelector(
    (state: RootState) => state.user
  );

  if (!isAuthenticated) {
    return <Navigate to="/company-login" replace />;
  }

  if (isAuthenticated && role !== "company") {
    return <Navigate to="/" replace />;
  }
  if (isAuthenticated && userData?.accountStatus.status == "Accepted") {
    return <Navigate to="/company" replace />;
  }
  return <Outlet />;
};

export default CompanyStatusRoutes;
