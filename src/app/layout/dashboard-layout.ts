import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../features/notifications/notification.service';
import { AuthService } from '../core/auth/auth.service';
import { LanguageService } from '../core/i18n/language.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
  imports: [CommonModule, RouterModule]
})
export class DashboardLayout {

  userName = localStorage.getItem('userName') || 'کاربر';
  userRole = localStorage.getItem('role') || 'employee';
// ✅ فقط routeهایی که در app.routes.ts تعریف شده‌اند
  menu = [
    { title: 'داشبورد', icon: '📊', link: 'dashboard', permission: 'dashboard.view' },
    { title: 'کاربران', icon: '👥', link: 'users', permission: 'users.view' },
    { title: 'درخواست‌ها', icon: '📝', link: 'requests', permission: 'requests.view' },
    { title: 'مرخصی', icon: '🗓️', link: 'leave', permission: 'requests.view' },
    { title: 'حقوق و دستمزد', icon: '💵', link: 'payroll', permission: 'payroll.view' },
    { title: 'استخدام', icon: '💼', link: 'recruitment', permission: 'requests.view' },
    { title: 'چت', icon: '💬', link: 'chat', permission: 'dashboard.view' }
  ];

  constructor(
private router: Router,
    public notif: NotificationService,
    public auth: AuthService,
    public language: LanguageService
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
