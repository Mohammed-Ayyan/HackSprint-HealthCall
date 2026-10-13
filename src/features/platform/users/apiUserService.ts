/**
 * CareOps AI - Real Backend User Management Client
 * 
 * Direct API client for the Express / MongoDB backend (/api/v1/users).
 * Drop-in replacement for mockUserService.
 */

import { User, UserRole } from "@/shared/types/user";
import { mapBackendRoleToFrontend, mapFrontendRoleToBackend } from "../auth/apiAuthService";
import { mockUsersList } from "../mockAuthService";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const TOKEN_KEY = "careops_jwt_token";

let localFallbackUsers: User[] = [...mockUsersList];

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function normalizeUserFromApi(apiUser: any): User {
  const feRole = mapBackendRoleToFrontend(apiUser.role);
  return {
    id: apiUser.id || apiUser._id,
    name: apiUser.name,
    email: apiUser.email,
    role: feRole,
    department: apiUser.department || "General",
    status: (apiUser.status || "active").toLowerCase() as any,
    avatar:
      apiUser.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    phone: apiUser.phone || "",
    assignedTasksCount: apiUser.assignedTasksCount || 0,
    completedTasksCount: apiUser.completedTasksCount || 0,
    avgResolutionMinutes: apiUser.avgResolutionMinutes || 25,
    lastActive: "Active",
  };
}

export const apiUserService = {
  /**
   * GET /api/v1/users
   * Retrieve hospital users with optional role, department, status, and search filters.
   */
  async getUsers(filters?: {
    role?: string;
    department?: string;
    status?: string;
    search?: string;
  }): Promise<User[]> {
    const token = getAuthToken();

    if (token) {
      try {
        const queryParams = new URLSearchParams();
        if (filters?.role) queryParams.append("role", filters.role);
        if (filters?.department) queryParams.append("department", filters.department);
        if (filters?.status) queryParams.append("status", filters.status);
        if (filters?.search) queryParams.append("search", filters.search);

        const url = `${BACKEND_BASE_URL}/users${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users)) {
            return data.users.map(normalizeUserFromApi);
          }
        }
      } catch (err: any) {
        console.warn("Backend user service unreachable, using fallback list:", err.message);
      }
    }

    // Offline / demo fallback
    return [...localFallbackUsers];
  },

  /**
   * GET /api/v1/users/:id
   * Retrieve single user details.
   */
  async getUserById(id: string): Promise<User | null> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            return normalizeUserFromApi(data.user);
          }
        }
      } catch (err: any) {
        console.warn("Backend user service unreachable:", err.message);
      }
    }

    const found = localFallbackUsers.find((u) => u.id === id);
    return found || null;
  },

  /**
   * POST /api/v1/users
   * Create a new hospital user account (Admin only).
   */
  async createUser(newUser: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    department?: string;
    phone?: string;
    avatar?: string;
    status?: string;
  }): Promise<User> {
    const token = getAuthToken();

    if (token) {
      try {
        const payload = {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password || "HospitalAdmin123!",
          role: mapFrontendRoleToBackend(newUser.role),
          department: newUser.department || "General",
          phone: newUser.phone || "",
          avatar: newUser.avatar || "",
          status: newUser.status || "ACTIVE",
        };

        const res = await fetch(`${BACKEND_BASE_URL}/users`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const normalized = normalizeUserFromApi(data.user);
            localFallbackUsers.unshift(normalized);
            return normalized;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to create user on backend");
        }
      } catch (err: any) {
        console.warn("Backend user creation failed, applying fallback:", err.message);
      }
    }

    // Local fallback
    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department || "General",
      status: "active",
      avatar:
        newUser.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      phone: newUser.phone || "",
      assignedTasksCount: 0,
      completedTasksCount: 0,
      avgResolutionMinutes: 0,
      lastActive: "Just now",
    };
    localFallbackUsers.unshift(fallbackUser);
    return fallbackUser;
  },

  // Backwards-compatible alias for existing frontend callers
  async addUser(newUser: any): Promise<User> {
    return this.createUser(newUser);
  },

  /**
   * PATCH /api/v1/users/:id
   * Update editable profile fields (Admin only).
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const token = getAuthToken();

    if (token) {
      try {
        const payload: any = { ...updates };
        if (updates.role) {
          payload.role = mapFrontendRoleToBackend(updates.role as UserRole);
        }

        const res = await fetch(`${BACKEND_BASE_URL}/users/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const normalized = normalizeUserFromApi(data.user);
            const idx = localFallbackUsers.findIndex((u) => u.id === id);
            if (idx !== -1) localFallbackUsers[idx] = normalized;
            return normalized;
          }
        }
      } catch (err: any) {
        console.warn("Backend user update failed:", err.message);
      }
    }

    // Local fallback
    const index = localFallbackUsers.findIndex((u) => u.id === id);
    if (index === -1) return null;
    localFallbackUsers[index] = { ...localFallbackUsers[index], ...updates };
    return localFallbackUsers[index];
  },

  /**
   * PATCH /api/v1/users/:id/status
   * Update status between ACTIVE, INACTIVE, and SUSPENDED.
   */
  async changeStatus(id: string, status: "ACTIVE" | "INACTIVE" | "SUSPENDED"): Promise<User | null> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/users/${id}/status`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            return normalizeUserFromApi(data.user);
          }
        }
      } catch (err: any) {
        console.warn("Backend user status update failed:", err.message);
      }
    }

    return this.updateUser(id, { status: status.toLowerCase() as any });
  },

  /**
   * DELETE /api/v1/users/:id
   * Soft deactivates account on backend (status = INACTIVE).
   */
  async deleteUser(id: string): Promise<boolean> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            localFallbackUsers = localFallbackUsers.filter((u) => u.id !== id);
            return true;
          }
        }
      } catch (err: any) {
        console.warn("Backend user deletion failed:", err.message);
      }
    }

    const initialLen = localFallbackUsers.length;
    localFallbackUsers = localFallbackUsers.filter((u) => u.id !== id);
    return localFallbackUsers.length < initialLen;
  },
};
