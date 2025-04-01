import { Outlet } from "react-router-dom";
import CompanySidebar from "../ui/company-sidebar";

function CompanyLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar remains constant */}
      <CompanySidebar />

      {/* Content changes based on the route */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default CompanyLayout;
