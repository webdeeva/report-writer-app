import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser } from '@/services/authService';
export const useAuthStore = create()(persist((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await loginUser(username, password);
            set({
                user: {
                    id: response.id,
                    username: response.username,
                    isAdmin: response.isAdmin,
                    isPremium: response.isPremium || false,
                },
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
            });
            // Store token in localStorage for API requests
            localStorage.setItem('authToken', response.token);
        }
        catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed',
            });
        }
    },
    logout: () => {
        // Remove token from localStorage
        localStorage.removeItem('authToken');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },
    checkAuth: () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Token exists, consider user authenticated
            // In a real app, you might want to validate the token with the server
            set({ isAuthenticated: true, token });
        }
        else {
            // No token, user is not authenticated
            set({ isAuthenticated: false, user: null, token: null });
        }
    },
}), {
    name: 'auth-storage', // Name for the persisted state
    partialize: (state) => ({
        // Only persist these fields
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
    }),
}));
