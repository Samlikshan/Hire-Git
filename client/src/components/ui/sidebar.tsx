import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Bell,
  Mail,
  BookmarkIcon,
  Clock,
  LogOut,
  Settings,
  Shield,
  CreditCard,
  HelpCircle,
  Menu,
  X,
  Briefcase,
  Award,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/reducers/userSlice";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    category: "Dashboard",
    items: [
      { name: "Profile", icon: <User size={20} /> },
      { name: "Jobs", icon: <Briefcase size={20} /> },
      { name: "Notifications", icon: <Bell size={20} />, badge: 3 },
      { name: "Messages", icon: <Mail size={20} />, badge: 5 },
    ],
  },
  {
    category: "Activity",
    items: [
      { name: "Job History", icon: <Clock size={20} /> },
      { name: "Saved Jobs", icon: <BookmarkIcon size={20} /> },
      { name: "Achievements", icon: <Award size={20} /> },
    ],
  },
  {
    category: "Settings",
    items: [
      { name: "Account", icon: <Settings size={20} /> },
      { name: "Privacy", icon: <Shield size={20} /> },
      { name: "Billing", icon: <CreditCard size={20} /> },
      { name: "Help", icon: <HelpCircle size={20} /> },
    ],
  },
];

const Sidebar = ({ currentPath }: { currentPath: string }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dispatch = useDispatch();

  const getLinkPath = (name: string) => {
    const base = "/profile";
    switch (name) {
      case "Profile":
        return base;
      case "Notifications":
        return `${base}/notifications`;
      case "Messages":
        return `${base}/messages`;
      case "Jobs":
        return `${base}/jobs`;
      default:
        return "";
    }
  };
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("main-sidebar");
      const mobileButton = document.getElementById("mobile-toggle");

      if (
        isMobileOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        mobileButton &&
        !mobileButton.contains(event.target)
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileOpen]);

  return (
    <>
      <button
        id="mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-xl shadow-xl hover:bg-indigo-700 transition-all duration-300 hover:scale-105"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
      )}

      <aside
        id="main-sidebar"
        className={cn(
          "fixed lg:sticky h-screen top-0 left-0 z-50 lg:z-30 transition-transform duration-300 ease-out",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-gray-100 dark:border-gray-800",
          "w-72 lg:w-80 lg:translate-x-0 rounded-lg",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "flex flex-col shadow-xl lg:shadow-none"
        )}
      >
        <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
          {menuItems.map((section) => (
            <div key={section.category} className="mb-6 last:mb-2">
              <h2 className="px-4 mb-3 text-[0.7rem] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {section.category}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const path = getLinkPath(item.name);
                  const isActive = currentPath === path;

                  return (
                    <li key={item.name}>
                      <Link
                        to={path}
                        className={cn(
                          "flex items-center w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                          "hover:bg-indigo-50/50 dark:hover:bg-gray-800/50",
                          isActive
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                            : "text-gray-600 dark:text-gray-300"
                        )}
                      >
                        <span
                          className={cn(
                            "transition-colors duration-200",
                            isActive
                              ? "text-indigo-500 dark:text-indigo-400"
                              : "text-gray-400 dark:text-gray-500 group-hover:text-indigo-500"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800/50">
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium 
              text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
