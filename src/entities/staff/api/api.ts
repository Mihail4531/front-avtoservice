import { api } from '@/shared/api/api';
import { type UpdateProfileSchema } from '@/features/update-me-profile/model/schema';

export const updateMeProfile = async (data: UpdateProfileSchema) => {
  
    const response = await api.put('/dashboard/me', data);
    return response.data;
};
