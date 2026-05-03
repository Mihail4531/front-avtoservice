import { LoginForm } from '@/features/auth/login/ui/LoginForm';

export const LoginPage = () => (
    <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
            <h1 className="text-2xl mb-6 font-bold text-center">Admin Panel</h1>
            <LoginForm />
        </div>
    </div>
);