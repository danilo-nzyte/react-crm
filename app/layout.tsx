import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { SearchProvider } from "@/contexts/search-context";
import { Toaster } from "@/components/ui/sonner";
import { RouteGuard } from "@/components/auth/route-guard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "React CRM",
  description: "A full stack CRM responsive app built with React and Go",
};

/**
 * Root layout component that provides global context providers
 * @param children - Child components to render within the layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <SearchProvider>
              <RouteGuard>
                <div className="flex min-h-screen flex-col lg:flex-row">
                  <Sidebar />
                  <div className="flex-1 lg:ml-64">
                    <Topbar />
                    <main className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">
                      {children}
                    </main>
                  </div>
                </div>
              </RouteGuard>
              <Toaster />
            </SearchProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
