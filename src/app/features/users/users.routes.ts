import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth/auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./users').then(m => m.Users),
    canMatch: [AuthGuard],
    data: { permission: 'users.view' }
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./user-form/user-form').then(m => m.UserForm),
    canMatch: [AuthGuard],
    data: { permission: 'users.edit' }
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./user-form/user-form').then(m => m.UserForm),
    canMatch: [AuthGuard],
    data: { permission: 'users.edit' }
  }
];
