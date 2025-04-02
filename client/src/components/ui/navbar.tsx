import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { logout } from "@/reducers/userSlice";
import { RootState } from "@/reducers/rootReducer";

export default function Navbar() {
  const { userData, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
        {/* Logo - Slightly left */}
        <div className="flex items-center -ml-1">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold">HireX</span>
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className="mx-auto flex items-center space-x-8">
          <Link
            to="/"
            className="text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className="text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Jobs
          </Link>
          <Link
            to="/about"
            className="text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            About Us
          </Link>
        </nav>

        {/* Right Section - Slightly right */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-6 -mr-1">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={
                        `${import.meta.env.VITE_S3_PATH}/${
                          userData?.profileImage
                        }`
                        // "https://placehold.co/300x300"
                      }
                      alt={userData?.name}
                    />
                    <AvatarFallback>
                      {userData?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`${import.meta.env.VITE_S3_PATH}/${
                        userData?.profileImage
                      }`}
                      alt={userData?.name}
                    />
                    <AvatarFallback>
                      {userData?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userData?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {userData?.role == "company" && (
                  <Link to="/company">
                    <DropdownMenuItem className="cursor-pointer">
                      Go To Dashboard
                    </DropdownMenuItem>
                  </Link>
                )}
                {userData?.role == "candidate" && (
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      View Profile
                    </DropdownMenuItem>
                  </Link>
                )}
                {userData?.role == "admin" && (
                  <Link to="/admin">
                    <DropdownMenuItem className="cursor-pointer">
                      Go To Dashbaord
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuItem className="cursor-pointer">
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  My Applications
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Saved Jobs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4 -mr-1">
            <Button
              variant="ghost"
              className="text-[15px] font-medium text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              className="rounded-md bg-blue-600 text-[15px] font-medium hover:bg-blue-700"
              asChild
            >
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
