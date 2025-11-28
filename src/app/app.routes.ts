import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.Login) },

  {
    path: '',
    loadComponent: () => import('./layout/dashboard-layout').then(m => m.DashboardLayout),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard), canActivate: [AuthGuard] },
      { path: 'users', loadComponent: () => import('./features/users/users').then(m => m.Users), canActivate: [AuthGuard] },
      { path: 'requests', loadComponent: () => import('./features/requests/requests').then(m => m.Requests), canActivate: [AuthGuard] },
      { path: 'leave', loadComponent: () => import('./features/leave/leave').then(m => m.Leave), canActivate: [AuthGuard] },
      { path: 'payroll', loadComponent: () => import('./features/payroll/salary-slip').then(m => m.SalarySlip), canActivate: [AuthGuard] },
      { path: 'recruitment', loadComponent: () => import('./features/recruitment/recruitment').then(m => m.Recruitment), canActivate: [AuthGuard] },
      {
  path: 'chat',
  loadComponent: () =>
    import('./features/chat/chat').then(m => m.Chat)
},

    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
