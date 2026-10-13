import { User, UserRole } from "@/shared/types/user";
import { authService, MOCK_USERS } from "./auth/authService";

export const mockUsersList: User[] = Object.values(MOCK_USERS);

/**
 * Backwards-compatible export mapping to centralized authService
 */
export const mockAuthService = {
  getCurrentUser(): User {
    return authService.getCurrentUser();
  },

  getCurrentRole(): UserRole {
    return authService.getCurrentRole();
  },

  async login(email: string, role: UserRole): Promise<User> {
    const res = await authService.login({ email, role });
    return res.user;
  },

  switchRole(role: UserRole): User {
    return authService.switchRole(role);
  },
};
