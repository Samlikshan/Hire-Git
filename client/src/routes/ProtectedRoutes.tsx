import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && role == "company") {
    return <Navigate to="/company" replace />;
  }
  if (isAuthenticated && role == "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
