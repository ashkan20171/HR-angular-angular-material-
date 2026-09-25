import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({providedIn:'root'})
export class RoleGuard implements CanActivate {
  constructor(private router:Router, private auth:AuthService){}
  canActivate(route:ActivatedRouteSnapshot): boolean|UrlTree {
    if (!this.auth.isLoggedIn) return this.router.createUrlTree(['/login']);
    const allowed=route.data['roles'] as string[]|undefined;
    if (!allowed || allowed.includes(this.auth.role)) return true;
    return this.router.createUrlTree(['/app/dashboard']);
  }
}
