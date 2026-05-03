import { LoginForm } from '@/features/auth/login/ui/LoginForm';

export const LoginPage = () => (
    <div className="flex h-screen items-center justify-center bg-background">
        <div className="bg-card p-8 rounded shadow-md w-96 border border-border">
            <h1 className="text-2xl mb-6 font-bold text-center text-foreground">Admin Panel</h1>
            <LoginForm />
        </div>
    </div>
);