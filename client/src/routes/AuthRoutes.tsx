import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );

  if (isAuthenticated && role == "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default AuthRoutes;
