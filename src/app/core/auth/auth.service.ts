import { Injectable } from '@angular/core';
import { Role, ROLE_PERMISSIONS } from './permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentRole: Role = 'Employee';

  constructor() {
    const savedRole = localStorage.getItem('userRole') as Role;
    if (savedRole) {
      this.currentRole = savedRole;
    }
  }

  // شبیه‌سازی لاگین
  login(username: string) {
    let role: Role = 'Employee';

    if (username === 'admin') role = 'Admin';
    else if (username === 'manager') role = 'Manager';

    this.currentRole = role;
    localStorage.setItem('userRole', role);

    return true;
  }

  getRole(): Role {
    return this.currentRole;
  }

  getPermissions() {
    return ROLE_PERMISSIONS[this.currentRole];
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  logout() {
    localStorage.removeItem('userRole');
  }
}
