export type Role = 'Admin' | 'Manager' | 'Employee';

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  Admin: [
    'dashboard.view',
    'users.view',
    'users.edit',
    'profile.view',
    'profile.edit'
  ],

  Manager: [
    'dashboard.view',
    'users.view',
    'profile.view'
  ],

  Employee: [
    'dashboard.view',
    'profile.view'
  ]
};
