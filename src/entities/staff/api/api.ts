import { api } from '@/shared/api/api';
import { type UpdateProfileSchema } from '@/features/update-me-profile/model/schema';
import { type UpdateStaffRequest } from '@/entities/staff/model/types';

export const updateMeProfile = async (data: UpdateProfileSchema) => {
    const response = await api.put('/dashboard/me', data);
    return response.data;
};

export const updateStaff = async (staffId: number, data: UpdateStaffRequest) => {
    const response = await api.put(`/dashboard/admin/staffs/${staffId}`, data);
    return response.data;
};
