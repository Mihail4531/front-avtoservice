import { useQuery } from '@tanstack/react-query';
import { staffApi, ListStaffsParams } from '@/entities/staff';
export const STAFFS_LIST_KEY = ['staffs', 'list'] as const;
export const useListStaffs = (params: ListStaffsParams) => {
  return useQuery({ queryKey: [...STAFFS_LIST_KEY, params], queryFn: () => staffApi.list(params), select: (res) => res.data });
};
