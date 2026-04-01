import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, LayoutDashboard, Megaphone, Users, FileText, Settings, Search, Bell, LogOut, Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

const navItems = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", path: "/dashboard/campaigns", icon: Megaphone },
  { label: "Influencers", path: "/dashboard/influencers", icon: Users },
  { label: "Reports", path: "/dashboard/reports", icon: FileText },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <BarChart3 className="h-7 w-7 text-primary" />
        {sidebarOpen && <span className="text-lg font-bold text-foreground">Sponsorlytics</span>}
      </div>
      <nav className="mt-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.path)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className={cn("hidden border-r border-border bg-card transition-all duration-300 md:flex md:flex-col", sidebarOpen ? "w-60" : "w-16")}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60 animate-slide-in-left border-r border-border bg-card">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSidebarOpen(!sidebarOpen); setMobileSidebarOpen(!mobileSidebarOpen); }} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary">
              {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 md:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search campaigns..." className="w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-lg p-2 hover:bg-secondary">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user?.avatar ?? "U"}
                </div>
                <span className="hidden text-sm font-medium text-foreground md:inline">{user?.name ?? "User"}</span>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:inline" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-border bg-card p-1 shadow-lg animate-scale-in">
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
