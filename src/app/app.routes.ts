import { Routes } from '@angular/router';

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
          import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },

      // Default child route
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 404 fallback
  { path: '**', redirectTo: 'login' }
];
