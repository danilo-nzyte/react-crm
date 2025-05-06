"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import {
  Users,
  Package,
  FileText,
  BarChart3,
  Settings,
  Menu,
  UsersRound,
  ClipboardList,
  User,
  FolderKanban,
  Home,
  LogOut,
  Briefcase,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LucideIcon } from "lucide-react";

/**
 * Interface for navigation items
 */
interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  section?: string;
}

/**
 * Sidebar component for navigation
 * Responsive design with mobile drawer functionality
 */
export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Don't render during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  /**
   * Navigation items for the sidebar, organized by sections
   */
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      section: "Admin",
    },
    {
      title: "Customers",
      href: "/customers",
      icon: Users,
      section: "Admin",
    },
    {
      title: "Products",
      href: "/products",
      icon: Package,
      section: "Admin",
    },
    {
      title: "Rate Cards",
      href: "/rate-cards",
      icon: FileText,
      section: "Admin",
    },
    {
      title: "Gangs",
      href: "/gangs",
      icon: UsersRound,
      section: "Admin",
    },
    {
      title: "Engineers",
      href: "/engineers",
      icon: User,
      section: "Admin",
    },
    {
      title: "Projects",
      href: "/projects",
      icon: Briefcase,
      section: "Admin",
    },
    {
      title: "Work Log Tracking",
      href: "/engineer-portal/log-work",
      icon: Clock,
      section: "Engineers",
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
      section: "Finance",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      section: "Finance",
    },
  ];

  // Group navigation items by section
  const groupedNavItems = navItems.reduce<Record<string, NavItem[]>>(
    (acc, item) => {
      const section = item.section || "Other";
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(item);
      return acc;
    },
    {}
  );

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-1">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">React CRM</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {Object.entries(groupedNavItems).map(([section, items]) => (
            <div key={section} className="mb-4">
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
                {section}
              </h3>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ||
                        pathname?.startsWith(`${item.href}/`)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 py-2">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground">
              {user?.email || ""}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 z-40 lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex h-full flex-col">{sidebarContent}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-background lg:flex">
        {sidebarContent}
      </div>
    </>
  );
}
