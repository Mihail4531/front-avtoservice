import { api } from '@/shared/api/base-api';
import {
  StaffResponse,
  StaffListResponse,
  UpdateMeRequest,
  ChangePasswordRequest,
  CreateStaffRequest,
  UpdateStaffRequest,
  ChangeStaffPasswordRequest,
  ListStaffsParams,
} from '../model/types';

export const staffApi = {
  // Me
  getMe: () =>
    api.get<StaffResponse>('/dashboard/me'),

  updateMe: (data: UpdateMeRequest) =>
    api.put<StaffResponse>('/dashboard/me', data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post<void>('/dashboard/me/password', data),

  // Admin
  create: (data: CreateStaffRequest) =>
    api.post<StaffResponse>('/dashboard/admin/staffs', data),

  list: (params: ListStaffsParams) =>
    api.get<StaffListResponse>('/dashboard/admin/staffs', { params }),

  update: (id: number, data: UpdateStaffRequest) =>
    api.put<StaffResponse>(`/dashboard/admin/staffs/${id}`, data),

  changeStaffPassword: (id: number, data: ChangeStaffPasswordRequest) =>
    api.post<void>(`/dashboard/admin/staffs/${id}/password`, data),
};