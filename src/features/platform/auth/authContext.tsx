"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/shared/types/user";
import { authService, LoginCredentials, AuthResponse } from "./authService";
import { getRoleDashboard } from "./rolePermissions";

interface AuthContextType {
  user: User;
  role: UserRole;
  isAuthenticated: boolean;
  loading: boolean;
  login: (creds: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => User;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync with localStorage on client mount
    setUser(authService.getCurrentUser());
  }, []);

  const login = async (creds: LoginCredentials): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const res = await authService.login(creds);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(authService.getCurrentUser());
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (role: UserRole): User => {
    const updated = authService.switchRole(role);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        isAuthenticated: true,
        loading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
