// Staff Entity Barrel File
export type { 
    Staff, 
    StaffRole, 
    UpdateStaffRequest, 
    StaffListResponse, 
    StaffFilters 
} from './model/types';
export { STAFF_ROLES } from './model/types';
export { useUpdateMe, useUpdateStaff } from './hooks/use-update';
export { updateStaff } from './api/api';
