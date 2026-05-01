import { Staff, StaffResponse } from './types';
export const mapStaffResponseToStaff = (dto: StaffResponse): Staff => ({
  id: dto.id, full_name: dto.full_name, email: dto.email,
  role: dto.role as Staff['role'], is_active: dto.is_active, created_at: dto.created_at,
});
export const mapStaffResponses = (dtos: StaffResponse[]): Staff[] => dtos.map(mapStaffResponseToStaff);
