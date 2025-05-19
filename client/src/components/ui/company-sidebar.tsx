import { NavLink } from "react-router-dom";
import {
  User,
  Calendar,
  Settings,
  LogOut,
  LayoutDashboard,
  UserPlus,
  Mail,
  SubtitlesIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/reducers/userSlice";
import { RootState } from "@/reducers/rootReducer";

const NavItem = ({
  to,
  icon: Icon,
  children,
  notifications,
}: {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  notifications?: number;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center rounded-lg px-3 py-2.5 transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-700 font-semibold"
            : "text-gray-600 hover:bg-gray-50"
        }`
      }
    >
      <div className="flex items-center gap-3 w-full">
        <Icon
          size={20}
          className={
            "group-[.bg-blue-50]:text-blue-700 " +
            (window.location.pathname === to
              ? "text-blue-700"
              : "text-gray-500")
          }
        />
        <span className="text-sm">{children}</span>
        {notifications && (
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
            {notifications}
          </span>
        )}
      </div>
    </NavLink>
  );
};

export default function CompanySidebar() {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(logout());
  };
  const user = useSelector((state: RootState) => state.user.userData);
  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Header/Logo */}
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-100 rounded-md"></div>
          <h1 className="text-xl font-bold text-gray-900">HireX</h1>
        </div>
      </div>

      {/* Company section */}
      <div className="mx-4 my-5 p-3 bg-white border border-gray-200 rounded-lg flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full  mr-3">
          {/* <svg
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.42-.48.12-.96-.18-1.08-.66-.12-.48.18-.96.66-1.08 4.38-1.32 9.78-.66 13.5 1.62.36.24.54.78.24 1.2l-.12.04zm.12-3.36c-3.84-2.28-10.2-2.5-13.86-1.38-.6.12-1.2-.24-1.32-.78-.12-.6.24-1.2.78-1.32 4.2-1.26 11.16-1.02 15.54 1.56.54.3.78 1.02.42 1.56-.3.42-1.02.66-1.56.36z" />
          </svg> */}
          <img
            className="w-8 h-8 rounded-full"
            src={`${import.meta.env.VITE_S3_PATH}/${user?.logo || ""}`}
            alt={user?.name}
          />
        </div>
        <span className="text-sm font-medium">{user?.name}</span>
      </div>

      {/* Main Navigation */}
      <div className="px-4">
        <h2 className="px-3 mb-2 text-xs text-gray-400">Main Menu</h2>
        <div className="space-y-1">
          <NavItem to="/company/dashboard" icon={LayoutDashboard}>
            Dashboard
          </NavItem>
          {/* <NavItem to="/company/jobs" icon={UserPlus} notifications={2}> */}
          <NavItem to="/company/jobs" icon={UserPlus}>
            Recruitment
          </NavItem>
          {/* <NavItem to="/company/schedule" icon={Calendar}>
            Schedule
          </NavItem> */}
          <NavItem to="/company/messages" icon={Mail}>
            Messages
          </NavItem>
          <NavItem to="/company/subscriptions" icon={SubtitlesIcon}>
            My Subscription
          </NavItem>
        </div>
      </div>

      {/* Account Navigation */}
      <div className="px-4 mt-auto mb-6">
        <div className="space-y-1">
          <NavItem to="/company/profile" icon={User}>
            Profile
          </NavItem>
          <NavItem to="/company/settings" icon={Settings}>
            Settings
          </NavItem>
          <button
            className="w-full flex items-center gap-3 text-gray-600 hover:bg-gray-50 rounded-lg px-3 py-2.5 transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={20} className="text-gray-500" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
