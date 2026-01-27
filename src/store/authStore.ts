import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

// Define the shape of our auth state
interface AuthState {
    // State
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;

    // Actions
    setAuth: (token: string, user: User) => void;
    updateUser: (user: User) => void;
    logout: () => void;
    clearAuth: () => void;
}

/*
Auth Store - Manages authentication state across the app
*/
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial state
            token: null,
            user: null,
            isAuthenticated: false,

            // Set authentication (called after successful login)
            setAuth: (token, user) => {
                set({
                    token,
                    user,
                    isAuthenticated: true
                });
            },
            // sync role changes from the server
            updateUser: (user) => {
                set({ user });
            },

            // Logout (clears everything)
            logout: () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false
                });
                localStorage.removeItem('token');
            },

            // Alternative clear method
            clearAuth: () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false
                });
            }
        }),
        {
            name: 'auth-storage' // Key in localStorage
        }
    )
);