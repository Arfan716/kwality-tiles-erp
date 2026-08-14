import { LogOut } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  Users,
  Building2,
  FileText,
  BarChart3,
  Settings,
  UserCog,
  User,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
} from "lucide-react";






const mobileNavigation = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Sales", href: "/sales", icon: Receipt },
  { name: "More", href: "/settings", icon: Menu },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem("userRole") || "staff";
  const permissions = JSON.parse(
  localStorage.getItem("permissions") || "[]"
);

const allNavigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    permission: "dashboard",
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    permission: "inventory",
  },
  {
    name: "Purchase Entry",
    href: "/purchase",
    icon: ShoppingCart,
    permission: "purchase",
  },
  {
    name: "Sales Billing",
    href: "/sales",
    icon: Receipt,
    permission: "sales",
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    permission: "customers",
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: Building2,
    permission: "suppliers",
  },
  {
    name: "Bills",
    href: "/bills",
    icon: FileText,
    permission: "bills",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    permission: "reports",
  },
  {
    name: "Staff Management",
    href: "/staff",
    icon: UserCog,
    permission: "staff",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    permission: "settings",
  },
];

const navigation = allNavigation.filter(
  (item) =>
    permissions.includes("all") ||
    permissions.includes(item.permission)
);
  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";
  const handleLogout = async () => {
  await supabase.auth.signOut();

  localStorage.clear();

  window.location.href = "/login";
};

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-card border-r border-border">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Kwality Tiles</h1>
                <p className="text-xs text-muted-foreground">& Granite</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
<div className="p-4 border-t border-border">
  <Link
    to="/profile"
    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
  >
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
      <User className="w-4 h-4 text-primary-foreground" />
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">
        {userName}
      </p>

      <p className="text-xs text-muted-foreground capitalize">
        {role}
      </p>
    </div>
  </Link>

  <button
    onClick={handleLogout}
    className="w-full mt-3 flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
  >
    <LogOut className="w-5 h-5" />
    <span>Logout</span>
  </button>
</div>
</div> 
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Kwality Tiles</h1>
                <p className="text-xs text-muted-foreground">& Granite</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-muted lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search */}
              <div className="hidden sm:flex items-center flex-1 max-w-lg">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-muted"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-muted relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </button>
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg flex-1 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
