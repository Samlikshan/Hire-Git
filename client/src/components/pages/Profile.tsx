import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../ui/navbar";
import ProfileCard from "../ui/ProfileCard";
import Sidebar from "../ui/sidebar";
import ExperienceSection from "../ui/ExperienceSections";

function Profile() {
  // const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <Sidebar currentPath={location.pathname} />
          </div>

          <div className="w-full lg:w-3/4 space-y-6 sm:space-y-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;

export function ProfileContent() {
  return (
    <>
      <ProfileCard />
      <ExperienceSection />
    </>
  );
}
