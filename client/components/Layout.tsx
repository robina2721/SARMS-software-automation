import { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  List,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Users,
  Building,
  UserCheck,
  Shield,
  KeyRound,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: React.ReactNode;
}

const roleColors: Record<UserRole, string> = {
  admin: "bg-destructive/15 text-destructive",
  customer: "bg-primary/15 text-primary",
  project_manager: "bg-accent/20 text-accent-foreground",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  customer: "Customer",
  project_manager: "Project Manager",
};

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: BarChart3,
      roles: ["admin", "customer", "project_manager"],
    },

    // Operational Section
    {
      name: "New Request",
      href: "/request/new",
      icon: Plus,
      roles: ["customer"],
    },
    { name: "My Requests", href: "/requests", icon: List, roles: ["customer"] },
    {
      name: "All Requests",
      href: "/requests/all",
      icon: List,
      roles: ["admin", "project_manager"],
    },

    // Master Data Section (Admin only)
    {
      name: "Employees",
      href: "/master/employees",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Cost Centers",
      href: "/master/cost-centers",
      icon: Building,
      roles: ["admin"],
    },
    {
      name: "Priority Config",
      href: "/master/priority-config",
      icon: Settings,
      roles: ["admin"],
    },

    // Account Management Section (Admin only)
    {
      name: "User Accounts",
      href: "/accounts/users",
      icon: UserCheck,
      roles: ["admin"],
    },
    {
      name: "Roles & Privileges",
      href: "/accounts/roles",
      icon: Shield,
      roles: ["admin"],
    },
    {
      name: "Password Reset",
      href: "/accounts/password-reset",
      icon: KeyRound,
      roles: ["admin"],
    },

    // System Section
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      roles: ["admin", "project_manager"],
    },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
  ].filter((item) => item.roles.includes(user.role));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/etairlines.png"
                alt="Ethiopian Airlines Wing Logo"
                className="h-8 w-auto"
              />
              <span className="hidden font-bold sm:inline-block">Welcome To ET-Airlines SARMS</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search requests..." className="pl-9 w-48 lg:w-64" />
            </div>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-xs w-fit ${roleColors[user.role]}`}
                    >
                      {roleLabels[user.role]}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <nav className="fixed left-0 top-0 h-full w-64 bg-background border-r shadow-lg">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center px-6 border-b">
                  <Link to="/" className="flex items-center space-x-2">
                    <img
                      src="/etairlines.png"
                      alt="Ethiopian Airlines Wing Logo"
                      className="h-8 w-auto"
                    />
                    <span className="font-bold">SARMS</span>
                  </Link>
                </div>
                <div className="flex-1 space-y-1 p-4">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Desktop Sidebar */}
        <nav className="hidden w-64 border-r bg-background/50 backdrop-blur md:block">
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-1 p-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-6">
            <WelcomeMessage />
            <div className="px-0">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
