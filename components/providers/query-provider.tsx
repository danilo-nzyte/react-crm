"use client";

/**
 * Client-side React Query provider component
 * Handles React Query setup for the application
 */
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Client-side React Query provider component
 * Creates a new QueryClient instance for each client session
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create a client with default configuration
  // Using useState ensures the QueryClient is created only once per client session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
