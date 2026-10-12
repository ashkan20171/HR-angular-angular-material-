import { Routes } from '@angular/router';
import { PermissionGuard } from '../../core/auth/permission.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./users').then(m => m.Users),
    canActivate: [PermissionGuard],
    data: { permission: 'employees.view' }
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./user-form/user-form').then(m => m.UserForm),
    canActivate: [PermissionGuard],
    data: { permission: 'employees.edit' }
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./user-form/user-form').then(m => m.UserForm),
    canActivate: [PermissionGuard],
    data: { permission: 'employees.edit' }
  }
];
