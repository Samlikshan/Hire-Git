import { NavLink } from "react-router-dom";
import {
  Home,
  Building,
  Users,
  LogOut,
  LayoutDashboard,
  Bell,
  Subtitles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/reducers/userSlice";
import { useDispatch } from "react-redux";

const NavItem = ({ to, icon: Icon, children, notifications }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center justify-between rounded-lg border border-transparent px-3 py-2 transition-all hover:bg-accent hover:shadow-sm ${
          isActive
            ? "bg-accent/50 text-accent-foreground"
            : "text-muted-foreground hover:text-accent-foreground"
        }`
      }
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className="shrink-0" />
        <span className="font-medium">{children}</span>
      </div>
      {notifications && (
        <Badge variant="secondary" className="ml-auto">
          {notifications}
        </Badge>
      )}
    </NavLink>
  );
};

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(logout());
  };
  return (
    <Card className="flex h-screen w-64 flex-col border-r bg-card p-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <LayoutDashboard size={20} className="text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">Management Console</p>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Navigation Sections */}
      <div className="flex-1 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </h2>
          <NavItem to="/admin/dashboard" icon={Home}>
            Dashboard
          </NavItem>
          <NavItem to="/admin/companies" icon={Building}>
            Companies
          </NavItem>
          {/* <NavItem to="/admin/companies" icon={Building} notifications={3}>
            Companies
          </NavItem> */}
          <NavItem to="/admin/candidates" icon={Users}>
            Candidates
          </NavItem>
          <NavItem to="/admin/subscriptions" icon={Subtitles}>
            Subscriptions
          </NavItem>
        </div>

        {/* Additional Navigation */}
        <div className="space-y-1">
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System
          </h2>
          <NavItem to="/admin/notifications" icon={Bell} notifications={5}>
            Notifications
          </NavItem>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4 pt-4">
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </Card>
  );
}
