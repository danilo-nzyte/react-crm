import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";

/**
 * MainNav component for the application's main navigation
 * @param className - Additional CSS classes to apply to the component
 */
export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/projects"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.startsWith("/projects")
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Projects
      </Link>
      <Link
        href="/customers"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.startsWith("/customers")
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Customers
      </Link>
      <Link
        href="/engineers"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname.startsWith("/engineers")
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Engineers
      </Link>
      <Link
        href="/engineer-portal"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary flex items-center",
          pathname.startsWith("/engineer-portal")
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        <ClipboardList className="h-4 w-4 mr-1" />
        Work Log Tracking
      </Link>
    </nav>
  );
}
