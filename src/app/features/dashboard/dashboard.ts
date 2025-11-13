import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [CommonModule]
})
export class Dashboard {

  userName = localStorage.getItem("userName") || "کاربر";

  // کارت‌ها
  stats = [
    { title: 'کاربران فعال', value: 128, icon: '🧑‍🤝‍🧑', color: '#4f46e5' },
    { title: 'درخواست‌های امروز', value: 12, icon: '📄', color: '#10b981' },
    { title: 'مرخصی مانده', value: '8 روز', icon: '🏖️', color: '#f59e0b' },
    { title: 'پیام‌های جدید', value: 3, icon: '📩', color: '#ef4444' }
  ];

  // جدول درخواست‌ها
  recentRequests = [
    { user: 'علی', type: 'مرخصی', date: '۱۴۰۳/۱۰/۲۳', status: 'pending' },
    { user: 'مریم', type: 'اضافه‌کاری', date: '۱۴۰۳/۱۰/۲۲', status: 'accepted' },
    { user: 'سارا', type: 'ماموریت', date: '۱۴۰۳/۱۰/۲۱', status: 'rejected' }
  ];

}
