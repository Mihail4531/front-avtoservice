'use client';

import { useState } from 'react';
import { useSessionStore } from '@/entities/session/model/store';
import { api } from '@/shared/api/api';
import { Button } from '@/shared/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface LogoutButtonProps {
    className?: string;
    variant?: 'ghost' | 'outline' | 'default';
}

export const LogoutButton = ({ className, variant = 'ghost' }: LogoutButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const logout = useSessionStore((state) => state.logout);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
           
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
        } finally {
            
            logout();
        }
    };

    return (
        <Button
            variant={variant}
            onClick={handleLogout}
            disabled={isLoading}
            className={cn("gap-2 font-bold transition-colors", className)}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <LogOut className="w-4 h-4" />
            )}
            Выйти
        </Button>
    );
};