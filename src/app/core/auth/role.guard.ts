import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
  const allowedRoles: string[] | undefined = route.data['roles'];
  const role = localStorage.getItem('role');

  // اگر رول تعریف نشده، یعنی مسیر عمومیِ لاگین‌شده‌ها
  if (!allowedRoles) {
    return true;
  }

  if (role && allowedRoles.includes(role)) {
    return true;
  }

  this.router.navigate(['/app/dashboard']);
  return false;
}

}
