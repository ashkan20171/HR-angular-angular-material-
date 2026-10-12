import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserService, UserRole } from '../../features/users/user.service';
import { AccountSecurityService } from './account-security.service';
import { SharedAuthApiService } from './shared-auth-api.service';
import { AccessControlService } from './access-control.service';
export type Role=UserRole;
@Injectable({providedIn:'root'}) export class AuthService{
 private platformId=inject(PLATFORM_ID);private users=inject(UserService);private security=inject(AccountSecurityService);private sharedApi=inject(SharedAuthApiService);private access=inject(AccessControlService);private get storage():Storage|null{return isPlatformBrowser(this.platformId)?localStorage:null}
 get role():Role{return (this.storage?.getItem('role') as Role)||'employee'} get isLoggedIn(){return !!this.storage?.getItem('authToken')}
 /** Single source of truth for frontend role permissions. */
 hasPermission(permission:string):boolean { return this.isLoggedIn && this.access.can(permission); }
 loginLocal(username:string,password:string):boolean{username=(username||'').trim();password=String(password??'');const candidate=this.users.getByUsername(username);if(!candidate||!this.storage){this.security.addEvent(username,false,'INVALID_CREDENTIALS');return false}if(candidate.active===false){this.security.addEvent(username,false,'DISABLED');return false}if(candidate.accountExpiresAt&&new Date(candidate.accountExpiresAt)<new Date()){this.security.addEvent(username,false,'EXPIRED');return false}if(candidate.lockedUntil&&new Date(candidate.lockedUntil)>new Date()){this.security.addEvent(username,false,'LOCKED');return false}const user=this.users.validate(username,password);if(!user){const p=this.security.policy();this.users.recordFailed(candidate.id,p.maxFailedAttempts,p.lockMinutes);this.security.addEvent(username,false,'INVALID_CREDENTIALS');return false}this.finishLogin(user,'logged-in');return true}
 async login(username:string,password:string):Promise<boolean>{username=(username||'').trim();password=String(password??'');return this.loginLocal(username,password)}
 private finishLogin(user:any,token:string){if(!this.storage)return;this.storage.setItem('authToken',token);this.storage.setItem('userName',user.username);this.storage.setItem('role',user.role);this.storage.setItem('userId',String(user.id));if(user.forcePasswordChange)this.storage.setItem('forcePasswordChange','1');else this.storage.removeItem('forcePasswordChange');this.security.startSession(user.username);this.security.addEvent(user.username,true,'SUCCESS')}
 async logout(){await this.sharedApi.logout();this.security.endCurrent();['authToken','userName','role','userId','forcePasswordChange'].forEach(k=>this.storage?.removeItem(k))}
}
