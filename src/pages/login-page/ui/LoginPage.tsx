import { LoginForm } from '@/features/login';
export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Автосервис</h1>
        <LoginForm />
      </div>
    </div>
  );
};
