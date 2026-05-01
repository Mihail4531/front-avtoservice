'use client';
import { useLogout } from '../api/use-logout';
import { Button } from '@/shared/ui/button';
export const LogoutButton = () => {
  const { mutate, isPending } = useLogout();
  return <Button variant="ghost" size="sm" onClick={() => mutate()} disabled={isPending}>{isPending ? '...' : 'Выйти'}</Button>;
};
