"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/shared/types/user";
import { authService, LoginCredentials, AuthResponse, MOCK_USERS } from "./authService";
import { getClientSession, saveSession } from "./sessionStore";

interface AuthContextType {
  user: User;
  role: UserRole;
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;
  login: (creds: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => User;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const fallback = initialUser || MOCK_USERS.Admin;
  const [user, setUser] = useState<User>(fallback);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Phase 2 -> 3: Client hydration: Resolve active user from sessionStore
    const clientUser = getClientSession();
    if (clientUser) {
      setUser(clientUser);
      setIsAuthenticated(true);
    } else if (initialUser) {
      saveSession(initialUser);
      setIsAuthenticated(true);
    }
    setIsHydrated(true);
  }, [initialUser]);

  const login = async (creds: LoginCredentials): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const res = await authService.login(creds);
      setUser(res.user);
      setIsAuthenticated(true);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      // Reset to unauthenticated admin template
      const defaultUser = MOCK_USERS.Admin;
      setUser(defaultUser);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (newRole: UserRole): User => {
    const updated = authService.switchRole(newRole);
    setUser(updated);
    setIsAuthenticated(true);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        isAuthenticated,
        loading,
        isHydrated,
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
