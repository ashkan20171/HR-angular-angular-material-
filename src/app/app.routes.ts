import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { RoleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login').then((m) => m.Login),
  },

  {
    path: 'app',
    loadComponent: () =>
      import('./layout/dashboard-layout').then((m) => m.DashboardLayout),
    canActivate: [AuthGuard],
    children: [
      // ✅ پیش‌فرض /app
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },

      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users').then((m) => m.Users),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] },
      },

      {
        path: 'requests',
        loadComponent: () =>
          import('./features/requests/requests').then((m) => m.Requests),
      },

      {
        path: 'leave',
        loadComponent: () =>
          import('./features/leave/leave').then((m) => m.Leave),
      },

      {
        path: 'payroll',
        loadComponent: () =>
          import('./features/payroll/salary-slip').then((m) => m.SalarySlip),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'accounting'] },
      },

      {
        path: 'recruitment',
        loadComponent: () =>
          import('./features/recruitment/recruitment').then((m) => m.Recruitment),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'hr'] },
      },

      {
        path: 'chat',
        loadComponent: () =>
          import('./features/chat/chat').then((m) => m.Chat),
      },
    ],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
