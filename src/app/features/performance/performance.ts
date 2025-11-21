import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performance.html',
  styleUrl: './performance.css'
})
export class Performance implements OnInit {

  kpi = [
    { title: 'میانگین عملکرد ماهانه', value: 87, icon: '📈', color: '#2563eb' },
    { title: 'بهره‌وری تیم', value: 92, icon: '⚡', color: '#10b981' },
    { title: 'حضور و غیاب', value: '96%', icon: '⏱️', color: '#f59e0b' },
    { title: 'درخواست‌های معوق', value: 4, icon: '📄', color: '#ef4444' }
  ];

  employees = [
    { name: 'علی', score: 95, tasks: 18, late: 1, trend: 'up' },
    { name: 'مریم', score: 88, tasks: 14, late: 0, trend: 'up' },
    { name: 'سارا', score: 77, tasks: 12, late: 3, trend: 'down' },
    { name: 'محمد', score: 69, tasks: 9, late: 4, trend: 'down' }
  ];

  constructor() {}

  ngOnInit(): void {}

  getScoreColor(score: number) {
    if (score >= 85) return 'good';
    if (score >= 70) return 'mid';
    return 'bad';
  }

}
