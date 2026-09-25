import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AccessControlService } from './access-control.service';
import { AuthService } from './auth.service';
@Injectable({providedIn:'root'})
export class PermissionGuard implements CanActivate {
 constructor(private access:AccessControlService, private auth:AuthService, private router:Router){}
 canActivate(route:ActivatedRouteSnapshot): boolean|UrlTree {
   if (!this.auth.isLoggedIn) return this.router.createUrlTree(['/login']);
   const permission=route.data['permission'] as string|undefined;
   return !permission || this.access.can(permission) ? true : this.router.createUrlTree(['/app/access-denied']);
 }
}
