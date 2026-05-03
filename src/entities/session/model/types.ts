// entities/session/model/types.ts
export interface User {
    id: number;
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export interface SessionState {
    user: User | null;
    isAuth: boolean;
    isInitialized: boolean;
}
