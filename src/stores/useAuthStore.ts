import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
}

// Mock user database (in-memory)
const users: Array<User & { password: string }> = [];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = users.find(
          (u) => u.email === email && u.password === password,
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }

        return false;
      },

      register: async (email: string, username: string, password: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check if user already exists
        if (users.find((u) => u.email === email || u.username === username)) {
          return false;
        }

        const newUser: User & { password: string } = {
          id: Math.random().toString(36).substring(7),
          email,
          username,
          password,
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);

        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
