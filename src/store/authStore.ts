import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define what a User looks like
interface User {
    id: number,
    username: string,
    email: string,
    role: 'admin' | 'manager' | 'customer';
}

// Define the shape of our auth state
interface AuthState {
    // State
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;

    // Actions
    setAuth: (token: string, user: User) => void;
    logout: () => void;
    clearAuth: () => void;
}
/*
Auth Store - Manages authentication state acress the app

Features:
-Persists to localStorage automatically 
_Provides login/logout functionality
-Tracks authentication status
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

            // Logout (clears everything)
            logout: () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false
                });
                // Also remove from localStorage
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