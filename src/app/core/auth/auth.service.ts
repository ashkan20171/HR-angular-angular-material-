import { Injectable } from '@angular/core';

export type Role = 'admin' | 'manager' | 'employee';

export interface AppUser {
  username: string;
  password: string;
  role: Role;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // لیست کاربران واقعی سیستم
  private users: AppUser[] = [
    { username: 'admin', password: '1234', role: 'admin' },
    { username: 'manager', password: '2222', role: 'manager' },
    { username: 'employee', password: '3333', role: 'employee' }
  ];

  constructor() {}

  // نقش فعلی کاربر
  get role(): Role {
    return (localStorage.getItem('role') as Role) || 'employee';
  }

  // بررسی دسترسی‌ها
  hasPermission(permission: string): boolean {
    const role = this.role;

    const permissions: Record<Role, string[]> = {
      admin: [
        'dashboard.view',
        'users.view',
        'users.edit',
        'requests.view',
        'payroll.view',
        'performance.view',
        'performance.add',
        'performance.edit',
        'profile.view'
      ],
      manager: [
        'dashboard.view',
        'users.view',
        'requests.view',
        'attendance.view',
        'payroll.view',
        'performance.view',
        'performance.add',
        'performance.edit',
        'profile.view'
      ],
      employee: [
        'dashboard.view',
        'attendance.view',
        'payroll.view',
        'performance.view',
        'profile.view'
      ],
      
    };

    return permissions[role].includes(permission);
  }

  // ⭐ متد جدید و صحیح login با خروجی true/false
  login(username: string, password: string): boolean {

    const user = this.users.find(
      u => u.username === username && u.password === password
    );

    if (!user) return false;

    // ذخیره اطلاعات
    localStorage.setItem('userName', user.username);
    localStorage.setItem('role', user.role);

    return true;
  }

  logout() {
    localStorage.clear();
  }
}
