import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../features/notifications/notification.service';
import { AuthService } from '../core/auth/auth.service';  // اطمینان از وارد کردن AuthService

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
  imports: [CommonModule, RouterModule]
})
export class DashboardLayout {

  userName = localStorage.getItem('userName') || 'کاربر';
  userRole = localStorage.getItem('role') || 'Employee';
  showNotif: any;
  currentDirection: 'rtl' | 'ltr' = 'rtl';  // متغیر تعیین جهت متن

  // اضافه کردن منو برای هر نقش
  menu = [
    { title: 'داشبورد', icon: '📊', link: '/dashboard', permission: 'dashboard.view' },
    { title: 'کاربران', icon: '👥', link: '/users', permission: 'users.view' },
    { title: 'پروفایل', icon: '🙍‍♂️', link: '/profile', permission: 'profile.view' },
    { title: 'حضور و غیاب', icon: '⏱️', link: '/attendance', permission: 'attendance.view' },
    { title: 'حقوق و دستمزد', icon: '💵', link: '/payroll', permission: 'payroll.view' },
    { title: 'درخواست‌ها', icon: '📝', link: '/requests', permission: 'requests.view' }
  ];

  constructor(private router: Router, public notif: NotificationService, public auth: AuthService) {}

  toggleNotif() {
    this.showNotif = !this.showNotif;
  }

  markAsRead(id: number) {
    this.notif.markAsRead(id);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
