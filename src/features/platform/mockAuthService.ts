import { User, UserRole } from "@/shared/types/user";

export const mockUsersList: User[] = [
  {
    id: "usr-1",
    name: "Dr. Aris Thorne",
    email: "a.thorne@metrohealth.org",
    role: "Doctor",
    department: "Clinical Team",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    assignedTasksCount: 4,
    completedTasksCount: 19,
    avgResolutionMinutes: 45,
    phone: "+1 (555) 019-2831",
    lastActive: "Now",
  },
  {
    id: "usr-2",
    name: "Sarah Jenkins",
    email: "s.jenkins@metrohealth.org",
    role: "Receptionist",
    department: "Reception",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    assignedTasksCount: 6,
    completedTasksCount: 32,
    avgResolutionMinutes: 18,
    phone: "+1 (555) 019-4412",
    lastActive: "3m ago",
  },
  {
    id: "usr-3",
    name: "Marcus Vance",
    email: "m.vance@metrohealth.org",
    role: "Insurance Employee",
    department: "Insurance",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    assignedTasksCount: 8,
    completedTasksCount: 24,
    avgResolutionMinutes: 72,
    phone: "+1 (555) 019-8902",
    lastActive: "1m ago",
  },
  {
    id: "usr-4",
    name: "David Ross",
    email: "d.ross@metrohealth.org",
    role: "Manager",
    department: "Billing",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    assignedTasksCount: 5,
    completedTasksCount: 41,
    avgResolutionMinutes: 30,
    phone: "+1 (555) 019-9111",
    lastActive: "Just now",
  },
  {
    id: "usr-5",
    name: "Elena Rostova",
    email: "e.rostova@metrohealth.org",
    role: "Admin",
    department: "Clinical Team",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    assignedTasksCount: 3,
    completedTasksCount: 58,
    avgResolutionMinutes: 25,
    phone: "+1 (555) 019-3890",
    lastActive: "Now",
  },
  {
    id: "usr-6",
    name: "Robert Sterling",
    email: "r.sterling@metrohealth.org",
    role: "Doctor",
    department: "Pharmacy",
    status: "on-call",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    assignedTasksCount: 2,
    completedTasksCount: 29,
    avgResolutionMinutes: 40,
    phone: "+1 (555) 019-5561",
    lastActive: "15m ago",
  },
];

let currentUser: User = mockUsersList[4]; // Default to Admin Elena Rostova

/**
 * Future backend replacement: src/features/platform/apiAuthService.ts
 */
export const mockAuthService = {
  getCurrentUser(): User {
    return currentUser;
  },

  switchRole(role: UserRole): User {
    const match = mockUsersList.find((u) => u.role === role);
    if (match) {
      currentUser = match;
    } else {
      currentUser = {
        ...currentUser,
        role,
      };
    }
    return currentUser;
  },

  async login(email: string, role: UserRole): Promise<User> {
    await new Promise((r) => setTimeout(r, 120));
    const match = mockUsersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (match) {
      currentUser = match;
    } else {
      currentUser = {
        id: `usr-${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
        department: "Clinical Team",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        assignedTasksCount: 0,
        completedTasksCount: 0,
        avgResolutionMinutes: 0,
        lastActive: "Now",
      };
    }
    return currentUser;
  },

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 60));
  },
};
