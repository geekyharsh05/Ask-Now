import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/data/auth";

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }
};

const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;secure;samesite=strict`;
  }
};

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Set authentication data (after login/signup)
      setAuth: (user: User, token: string) => {
        // Store in cookies for middleware access
        setCookie('auth-token', token);
        setCookie('user-id', user.id);
        
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Clear authentication data (logout)
      clearAuth: () => {
        // Remove from cookies
        deleteCookie('auth-token');
        deleteCookie('user-id');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Update user information
      updateUser: (updatedUser: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updatedUser },
          });
        }
      },
    }),
    {
      name: "auth-storage", // Name of the localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist user, token, and isAuthenticated
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Restore cookies on hydration
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof window !== 'undefined') {
          setCookie('auth-token', state.token);
          if (state.user?.id) {
            setCookie('user-id', state.user.id);
          }
        }
      },
    }
  )
);

// Helper hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
