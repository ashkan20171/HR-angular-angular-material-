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

  stats = [
    { title: 'کاربران فعال', value: 128, icon: '🧑‍🤝‍🧑', color: '#4f46e5' },
    { title: 'درخواست‌های امروز', value: 12, icon: '📄', color: '#10b981' },
    { title: 'مرخصی در انتظار', value: 5, icon: '🕒', color: '#f59e0b' },
    { title: 'پیام‌های جدید', value: 3, icon: '📩', color: '#ef4444' }
  ];

}
