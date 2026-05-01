export interface SessionUser {
  id: number;
  role: 'manager' | 'admin' | 'super_admin';
  email: string;
}
