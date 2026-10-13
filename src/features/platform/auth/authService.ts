import { User, UserRole } from "@/shared/types/user";
import { getRoleDashboard } from "./rolePermissions";
import {
  saveSession,
  clearSession,
  getClientSession,
  getClientToken,
} from "./sessionStore";

export interface LoginCredentials {
  email: string;
  password?: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  role: UserRole;
  user: User;
  token: string;
  redirectTo: string;
  error?: string;
}

export const MOCK_USERS: Record<UserRole, User> = {
  Patient: {
    id: "usr-pat-01",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    role: "Patient",
    department: "Patient Access & Care Experience",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 349-8812",
    lastActive: "Now",
  },
  Doctor: {
    id: "usr-doc-01",
    name: "Dr. Rahul",
    email: "dr.rahul@metrohealth.eco",
    role: "Doctor",
    department: "Post-Surgical General & Acute Recovery",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    assignedTasksCount: 8,
    completedTasksCount: 42,
    avgResolutionMinutes: 35,
    phone: "+1 (555) 749-2101",
    lastActive: "Now",
  },
  Receptionist: {
    id: "usr-rec-01",
    name: "Clara Oswald",
    email: "clara.o@metrohealth.eco",
    role: "Receptionist",
    department: "Central Intake & Scheduling",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    assignedTasksCount: 6,
    completedTasksCount: 38,
    avgResolutionMinutes: 12,
    phone: "+1 (555) 482-9912",
    lastActive: "2m ago",
  },
  "Insurance Employee": {
    id: "usr-ins-01",
    name: "Marcus Sterling",
    email: "marcus.s@metrohealth.eco",
    role: "Insurance Employee",
    department: "RCM & Prior-Authorization Division",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    assignedTasksCount: 14,
    completedTasksCount: 52,
    avgResolutionMinutes: 65,
    phone: "+1 (555) 881-3329",
    lastActive: "Now",
  },
  Manager: {
    id: "usr-mgr-01",
    name: "Dr. Eleanor Vance",
    email: "eleanor.v@metrohealth.eco",
    role: "Manager",
    department: "Surgical Recovery & Operations Management",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    assignedTasksCount: 5,
    completedTasksCount: 88,
    avgResolutionMinutes: 28,
    phone: "+1 (555) 993-4411",
    lastActive: "Now",
  },
  Admin: {
    id: "usr-adm-01",
    name: "Dr. Evelyn Vance",
    email: "admin@metrohealth.eco",
    role: "Admin",
    department: "Executive Healthcare Administration",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    assignedTasksCount: 3,
    completedTasksCount: 124,
    avgResolutionMinutes: 20,
    phone: "+1 (555) 001-9988",
    lastActive: "Now",
  },
};

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Enterprise Authentication Service
 * Seamlessly integrates live API endpoints with cookie & localStorage persistence
 */
export const authService = {
  getStoredUser(): User | null {
    return getClientSession();
  },

  getCurrentUser(): User {
    const stored = getClientSession();
    if (stored) return stored;
    return MOCK_USERS.Admin;
  },

  getCurrentRole(): UserRole {
    return this.getCurrentUser().role;
  },

  getToken(): string | null {
    return getClientToken();
  },

  setSession(user: User, token?: string): void {
    saveSession(user, token);
  },

  clearSession(): void {
    clearSession();
  },

  async login(creds: LoginCredentials): Promise<AuthResponse> {
    if (!creds.email || !creds.password) {
      throw new Error("Please enter both email and password.");
    }

    const response = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: creds.email.trim(),
        password: creds.password,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success || !data.user) {
      throw new Error(data.message || "Invalid email or password");
    }

    const { mapBackendRoleToFrontend } = await import("./apiAuthService");
    const feRole = mapBackendRoleToFrontend(data.user.role);

    const user: User = {
      id: data.user.id || data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: feRole,
      department: data.user.department || "General Hospital",
      status: "active",
      avatar: data.user.avatar || "",
      phone: data.user.phone || "",
      lastActive: "Now",
    };

    saveSession(user, data.token);

    return {
      success: true,
      role: feRole,
      user,
      token: data.token,
      redirectTo: getRoleDashboard(feRole),
    };
  },

  async register(params: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department?: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const { apiAuthService } = await import("./apiAuthService");
    return apiAuthService.register(params);
  },

  async fetchCurrentUser(): Promise<User | null> {
    const token = getClientToken();
    if (!token) return getClientSession();

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && (data.id || data._id)) {
        const { mapBackendRoleToFrontend } = await import("./apiAuthService");
        const feRole = mapBackendRoleToFrontend(data.role);
        const user: User = {
          id: data.id || data._id,
          name: data.name,
          email: data.email,
          role: feRole,
          department: data.department || "",
          status: "active",
          avatar: data.avatar || "",
          phone: data.phone || "",
          lastActive: "Now",
        };
        saveSession(user, token);
        return user;
      }
    } catch {
      // Ignore network errors
    }

    return getClientSession();
  },

  async logout(): Promise<void> {
    try {
      const token = getClientToken();
      if (token) {
        await fetch(`${BACKEND_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // ignore network errors
    }
    clearSession();
  },

  switchRole(role: UserRole): User {
    const current = getClientSession();
    if (current) return current;
    return MOCK_USERS.Admin;
  },
};
