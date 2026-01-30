import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  type UserDTO,
} from "@/lib/auth.actions";

interface AuthState {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: UserDTO | null) => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      setUser: (user: UserDTO | null) => {
        set({ user, isAuthenticated: !!user });
      },

      refreshUser: async () => {
        try {
          const user = await getCurrentUser();
          set({ user, isAuthenticated: !!user });
        } catch (error) {
          console.error("Failed to refresh user:", error);
        }
      },

      initialize: async () => {
        try {
          const user = await getCurrentUser();
          if (user) {
            set({ user, isAuthenticated: true, isInitialized: true });
          } else {
            set({ user: null, isAuthenticated: false, isInitialized: true });
          }
        } catch (error) {
          console.error("Failed to initialize auth:", error);
          set({ isInitialized: true });
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
        // Clear game-specific storages
        if (typeof window !== "undefined") {
          localStorage.removeItem("mining-adventure-storage");
          localStorage.removeItem("game-storage");
        }
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
