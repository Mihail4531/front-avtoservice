'use client';
import Link from 'next/link';
import { LogoutButton } from '@/features/logout';
export const AppHeader = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">Автосервис</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/me/profile" className="hover:underline">Профиль</Link>
            <Link href="/admin/staffs" className="hover:underline">Сотрудники</Link>
          </nav>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
};
