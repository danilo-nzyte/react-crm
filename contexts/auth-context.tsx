"use client";

/**
 * Authentication context provider for managing user authentication state
 * Handles login, logout, and current user information
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/lib/api";

// Add this near the top of the file
const DEV_MODE = process.env.NODE_ENV === "development";
const USE_MOCK_AUTH = DEV_MODE && true; // Set to true to enable mock auth in development

// User type definition
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "engineer";
  avatar?: string;
}

// Authentication context state
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  error: null,
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 * Manages authentication state and provides login/logout functions
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      // For development, you can use this mock authentication
      if (USE_MOCK_AUTH) {
        setUser({
          id: "dev-user-123",
          email: "dev@example.com",
          name: "Development User",
          role: "admin",
        });
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("auth_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch current user data
        const userData = await api.get<User>("/auth/me");
        setUser(userData);
      } catch (err) {
        // Clear invalid token
        localStorage.removeItem("auth_token");
        setError("Session expired. Please login again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login function - authenticates user and stores token
   * @param email - User email
   * @param password - User password
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    // For development, allow login with any credentials
    if (USE_MOCK_AUTH) {
      setUser({
        id: "dev-user-123",
        email: email || "dev@example.com",
        name: "Development User",
        role: "admin",
      });
      localStorage.setItem("auth_token", "mock-jwt-token");
      setIsLoading(false);
      return;
    }

    try {
      // Call login API
      const response = await api.post<{ token: string; user: User }>(
        "/auth/login",
        {
          email,
          password,
        }
      );

      // Store token and user data
      localStorage.setItem("auth_token", response.token);
      setUser(response.user);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function - clears user session
   */
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the auth context
 * @returns Authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
