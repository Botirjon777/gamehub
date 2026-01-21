import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  type User,
} from "@/lib/auth.actions";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initialize: async () => {
        try {
          const user = await getCurrentUser();
          if (user) {
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          console.error("Failed to initialize auth:", error);
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const result = await loginUser(email, password);

          if (result.success && result.user) {
            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: result.error || "Login failed",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: "An unexpected error occurred",
            isLoading: false,
          });
          return false;
        }
      },

      register: async (email: string, username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const result = await registerUser(email, username, password);

          if (result.success && result.user) {
            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: result.error || "Registration failed",
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: "An unexpected error occurred",
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        await logoutUser();
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => {
        set({ error: null });
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
