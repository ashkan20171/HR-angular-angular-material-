import { Injectable } from '@angular/core';

export type Role = 'admin' | 'manager' | 'employee' | 'hr' | 'accounting';

export interface AppUser {
  username: string;
  password: string;
  role: Role;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // لیست کاربران سیستم
  private users: AppUser[] = [
    { username: 'admin', password: '1234', role: 'admin' },
    { username: 'manager', password: '2222', role: 'manager' },
    { username: 'employee', password: '3333', role: 'employee' },
    { username: 'hruser', password: '4444', role: 'hr' },
    { username: 'accountinguser', password: '5555', role: 'accounting' }
  ];

  constructor() {}

  // نقش فعلی کاربر
  get role(): Role {
    return (localStorage.getItem('role') as Role) || 'employee';
  }

  // بررسی لاگین بودن کاربر
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
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
      hr: [
        'dashboard.view',
        'users.view',
        'users.edit',
        'requests.view',
        'attendance.view',
        'payroll.view',
        'performance.view',
        'performance.add',
        'profile.view'
      ],
      accounting: [
        'dashboard.view',
        'payroll.view',
        'payroll.add',
        'payroll.view-details',
        'profile.view'
      ]
    };

    return permissions[role]?.includes(permission);
  }

  // لاگین
  login(username: string, password: string): boolean {
    const user = this.users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return false;
    }

    // ذخیره اطلاعات کاربر
    localStorage.setItem('authToken', 'logged-in'); // برای AuthGuard
    localStorage.setItem('userName', user.username);
    localStorage.setItem('role', user.role);

    return true;
  }

  // لاگ‌اوت
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
  }
}
