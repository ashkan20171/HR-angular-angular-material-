import { Routes } from '@angular/router';

export const routes: Routes = [

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login').then(m => m.Login)
  },

  // Protected App Layout
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout')
        .then(m => m.DashboardLayout),
    children: [

      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },

      // Users
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users').then(m => m.Users)
      },

      // Requests
      {
        path: 'requests',
        loadComponent: () =>
          import('./features/requests/requests').then(m => m.Requests)
      },

      // Leave Management
      {
        path: 'leave',
        loadComponent: () =>
          import('./features/leave/leave').then(m => m.Leave)
      },

      // Payroll
      {
        path: 'payroll',
        loadComponent: () =>
          import('./features/payroll/salary-slip').then(m => m.SalarySlip)
      },


      // Recruitment System
      {
        path: 'recruitment',
        loadComponent: () =>
          import('./features/recruitment/recruitment').then(m => m.Recruitment)
      },
      {
        path: 'recruitment/new',
        loadComponent: () =>
          import('./features/recruitment/job-form/job-form').then(m => m.JobForm)
      },
      {
        path: 'recruitment/:id',
        loadComponent: () =>
          import('./features/recruitment/job-detail/job-detail').then(m => m.JobDetail)
      },

      // Messages / Inbox
      {
        path: 'inbox',
        loadComponent: () =>
          import('./features/messages/inbox/inbox').then(m => m.Inbox)
      },

    ]
  },

  // Redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];
