import { create } from 'zustand';
import { api } from '@/shared/api/api';

interface User {
    id: number;
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string; // В JSON приходит как строка (ISO 8601)
}

interface SessionState {
    user: User | null;
    isAuth: boolean;
    isInitialized: boolean;
    initAuth: () => Promise<void>;
    logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    user: null,
    isAuth: false,
    isInitialized: false,

    initAuth: async () => {
        try {
            const { data } = await api.get('/dashboard/me');
            set({ user: data, isAuth: true, isInitialized: true });
        } catch {
            set({ user: null, isAuth: false, isInitialized: true });
        }
    },

    logout: () => {
        set({ user: null, isAuth: false, isInitialized: true });
    },
}));