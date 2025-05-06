"use client";

/**
 * Topbar component for the application
 * Contains search bar and notifications
 */
import { useState } from "react";
import { useSearch } from "@/contexts/search-context";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/search/search-bar";

/**
 * Topbar component
 * Provides search functionality and notifications
 */
export function Topbar() {
  const [notifications, setNotifications] = useState(3); // Mock notification count

  return (
    <div className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b bg-background px-4 lg:px-6">
      {/* Search bar - add left padding on mobile for hamburger menu */}
      <div className="flex w-full max-w-sm items-center pl-12 lg:pl-0">
        <SearchBar className="md:w-[300px] lg:w-[400px]" />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {notifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
