import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../features/notifications/notification.service';

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

  constructor(private router: Router, public notif: NotificationService) {}


  menu = [
  { title: 'داشبورد', icon: '📊', link: '/dashboard', permission: 'dashboard.view' },
  { title: 'کاربران', icon: '👥', link: '/users', permission: 'users.view' },
  { title: 'پروفایل', icon: '🙍‍♂️', link: '/profile', permission: 'profile.view' },
  
];

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
