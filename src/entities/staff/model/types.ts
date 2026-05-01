export interface Staff {
  id: number;
  full_name: string;
  email: string;
  role: 'manager' | 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}
export interface UpdateMeRequest { full_name: string; email: string; }
export interface ChangePasswordRequest { old_password: string; password: string; }
export interface CreateStaffRequest { full_name: string; email: string; password: string; role: 'manager' | 'admin'; }
export interface UpdateStaffRequest { full_name: string; email: string; role: 'manager' | 'admin' | 'super_admin'; is_active: boolean; }
export interface ChangeStaffPasswordRequest { password: string; }
export interface ListStaffsParams { limit?: number; offset?: number; is_active?: boolean; created_at_from?: string; created_at_to?: string; search?: string; }
export interface StaffResponse { id: number; full_name: string; email: string; role: string; is_active: boolean; created_at: string; }
export interface StaffListResponse { items: StaffResponse[]; total: number; limit: number; offset: number; }
