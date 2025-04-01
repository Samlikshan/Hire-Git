import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin-sidebar";

function Admin() {
  return (
    <div className="flex h-screen">
      {/* Sidebar remains constant */}
      <AdminSidebar />

      {/* Content changes based on the route */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
