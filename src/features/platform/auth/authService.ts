import { User, UserRole } from "@/shared/types/user";
import { getRoleDashboard } from "./rolePermissions";

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

const STORAGE_KEY = "careops_auth_session";

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to parse stored auth session", err);
  }
  return null;
}

function setStoredUser(user: User | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error("Failed to save auth session", err);
  }
}

/**
 * Enterprise Authentication Service
 * Future replacement point: POST /api/auth/login, POST /api/auth/logout
 */
export const authService = {
  getCurrentUser(): User {
    const stored = getStoredUser();
    if (stored) return stored;
    return MOCK_USERS.Admin;
  },

  getCurrentRole(): UserRole {
    return this.getCurrentUser().role;
  },

  async login(creds: LoginCredentials): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 60));

    // Resolve matching template user based on selected role
    const templateUser = MOCK_USERS[creds.role] || MOCK_USERS.Admin;

    const loggedInUser: User = {
      ...templateUser,
      email: creds.email || templateUser.email,
    };

    setStoredUser(loggedInUser);

    return {
      success: true,
      role: loggedInUser.role,
      user: loggedInUser,
      token: `mock-jwt-token-${Date.now()}`,
      redirectTo: getRoleDashboard(loggedInUser.role),
    };
  },

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 40));
    setStoredUser(null);
  },

  switchRole(role: UserRole): User {
    const user = MOCK_USERS[role] || MOCK_USERS.Admin;
    setStoredUser(user);
    return user;
  },
};
