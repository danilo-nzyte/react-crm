"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

/**
 * Interface for navigation items
 */
interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}

/**
 * Sidebar component for application navigation
 * Provides links to different sections of the application
 */
export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /**
   * Navigation items for the sidebar
   */
  const navItems: NavItem[] = [
    {
      title: "Customers",
      href: "/customers",
      icon: <Users className="h-5 w-5" />,
      section: "Admin",
    },
    {
      title: "Products",
      href: "/products",
      icon: <Package className="h-5 w-5" />,
      section: "Admin",
    },
    {
      title: "Rate Cards",
      href: "/rate-cards",
      icon: <FileText className="h-5 w-5" />,
      section: "Admin",
    },
    {
      title: "Gangs",
      href: "/gangs",
      icon: <UsersRound className="h-5 w-5" />,
      section: "Admin",
    },
    {
      title: "Engineers",
      href: "/engineers",
      icon: <User className="h-5 w-5" />,
      section: "Admin",
    },
    {
      title: "Projects",
      href: "/projects",
      icon: <FolderKanban className="h-5 w-5" />,
      section: "Admin",
    },
    {
      title: "Work Log Tracking",
      href: "/engineer-portal",
      icon: <ClipboardList className="h-5 w-5" />,
      section: "Engineers",
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      section: "Finance",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  /**
   * Renders the sidebar content with sections
   */
  const renderSidebarContent = () => {
    // Group items by section
    const sections: Record<string, NavItem[]> = {};
    const noSectionItems: NavItem[] = [];

    navItems.forEach((item) => {
      if (item.section) {
        if (!sections[item.section]) {
          sections[item.section] = [];
        }
        sections[item.section].push(item);
      } else {
        noSectionItems.push(item);
      }
    });

    return (
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                CRM
              </span>
            </div>
            <span>React CRM</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium space-y-6">
            {/* Render sections */}
            {Object.entries(sections).map(([sectionName, sectionItems]) => (
              <div key={sectionName} className="space-y-1">
                <h2 className="px-3 text-lg font-semibold tracking-tight text-gray-500">
                  {sectionName}
                </h2>
                {sectionItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      pathname === item.href ||
                        pathname.startsWith(item.href + "/")
                        ? "bg-muted text-primary"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}

            {/* Render items without section */}
            {noSectionItems.length > 0 && (
              <div className="space-y-1">
                {noSectionItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      pathname === item.href
                        ? "bg-muted text-primary"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium">Admin User</p>
              <p className="text-xs">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 flex-col fixed inset-y-0 border-r">
        {renderSidebarContent()}
      </div>
    </>
  );
}
