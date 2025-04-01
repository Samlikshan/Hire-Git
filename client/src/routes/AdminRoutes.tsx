import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }
  if (isAuthenticated && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;
