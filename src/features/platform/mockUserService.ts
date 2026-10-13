import { User, UserRole } from "@/shared/types/user";
import { DepartmentName } from "@/shared/types/action";
import { mockUsersList } from "./mockAuthService";

let currentUsers: User[] = [...mockUsersList];

/**
 * Future backend replacement: src/features/platform/apiUserService.ts
 */
export const mockUserService = {
  async getUsers(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [...currentUsers];
  },

  async addUser(newUser: Omit<User, "id" | "assignedTasksCount" | "completedTasksCount" | "avgResolutionMinutes" | "lastActive">): Promise<User> {
    await new Promise((r) => setTimeout(r, 80));
    const user: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
      assignedTasksCount: 0,
      completedTasksCount: 0,
      avgResolutionMinutes: 0,
      lastActive: "Just now",
    };
    currentUsers.unshift(user);
    return user;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    await new Promise((r) => setTimeout(r, 60));
    const index = currentUsers.findIndex((u) => u.id === id);
    if (index === -1) return null;
    currentUsers[index] = { ...currentUsers[index], ...updates };
    return currentUsers[index];
  },

  async deleteUser(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const initialLen = currentUsers.length;
    currentUsers = currentUsers.filter((u) => u.id !== id);
    return currentUsers.length < initialLen;
  },
};
