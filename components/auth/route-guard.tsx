"use client";

/**
 * Route guard component to protect routes from unauthenticated users
 * Redirects to login page if user is not authenticated
 */
import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

// Public paths that don't require authentication
const publicPaths = ["/auth/login", "/auth/register", "/auth/forgot-password"];

interface RouteGuardProps {
  children: ReactNode;
}

/**
 * Route guard component
 * Checks if user is authenticated and redirects to login if not
 */
export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if the route is public
    const isPublicPath = publicPaths.includes(pathname);

    // Authentication check
    if (!isLoading) {
      if (!isAuthenticated && !isPublicPath) {
        // Redirect to login page if not authenticated and not on a public path
        setAuthorized(false);
        router.push("/auth/login");
      } else {
        setAuthorized(true);
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading or nothing while checking authentication
  if (isLoading || !authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authorized, render children
  return <>{children}</>;
}
