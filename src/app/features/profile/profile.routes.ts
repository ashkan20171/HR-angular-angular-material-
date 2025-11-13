import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./profile').then(m => m.Profile),
    canMatch: [AuthGuard],
    data: { permission: 'profile.view' }
  }
];
