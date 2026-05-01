export interface StaffFilterFormData {
  search: string;
  is_active: '' | 'true' | 'false';
  created_at_from: string;
  created_at_to: string;
}
