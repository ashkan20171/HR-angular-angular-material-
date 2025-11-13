import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [

  // Login page (lazy)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login').then(m => m.Login)
  },

  // Protected part of the app (with layout)
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout').then(m => m.DashboardLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard),
        canMatch: [AuthGuard],
        data: { permission: 'dashboard.view' }
      },

      {
  path: 'users',
  loadComponent: () =>
    import('./features/users/users').then(m => m.Users),
  canMatch: [AuthGuard],
  data: { permission: 'users.view' }
},
{
  path: 'users/add',
  loadComponent: () =>
    import('./features/users/add-user/add-user').then(m => m.AddUserComponent)
},
{
  path: 'users/edit/:id',
  loadComponent: () =>
    import('./features/users/edit-user/edit-user').then(m => m.EditUserComponent)
},
{
  path: 'profile',
  loadComponent: () =>
    import('./features/profile/profile').then(m => m.ProfileComponent),
  canMatch: [AuthGuard],
  data: { permission: 'profile.view' }
},
      // Default child route
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 404 fallback
  { path: '**', redirectTo: 'login' }
];
