import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanMatchFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredPermission = route.data?.['permission'];

  if (!requiredPermission) return true;

  if (auth.hasPermission(requiredPermission)) {
    return true;
  }

  router.navigate(['/403']);
  return false;
};
