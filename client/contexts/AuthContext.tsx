import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authApi } from "@/services/api";

export type UserRole = "admin" | "customer" | "project_manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth token on app start
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // You could add a verify token endpoint here
          // const response = await authApi.verifyToken();
          // if (response.success) setUser(response.data.user);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    checkAuthToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);

      // Fallback to mock data for development
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Admin",
          email: "admin@company.com",
          role: "admin",
        },
        {
          id: "2",
          name: "Jane Customer",
          email: "customer@company.com",
          role: "customer",
          department: "IT",
        },
        {
          id: "3",
          name: "Mike PM",
          email: "pm@company.com",
          role: "project_manager",
        },
      ];

      const foundUser = mockUsers.find((u) => u.email === email);
      if (foundUser && password === "password") {
        setUser(foundUser);
        return true;
      }
      return false;
    }
  };



  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await authApi.forgotPassword(email);
      return response.success;
    } catch (error) {
      console.error('Forgot password error:', error);
      // Fallback to mock for development
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        forgotPassword,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
