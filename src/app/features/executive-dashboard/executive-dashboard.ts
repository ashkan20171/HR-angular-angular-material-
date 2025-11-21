import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-executive-dashboard',
  standalone: true,
  templateUrl: './executive-dashboard.html',
  styleUrl: './executive-dashboard.css',
  imports: [CommonModule]
})
export class ExecutiveDashboard {

  // KPIهای کلان سازمان
  executiveKPIs = [
    { title: 'نیروی انسانی فعال', value: 412, icon: '👥', color: '#0ea5e9' },
    { title: 'نرخ ماندگاری', value: '92%', icon: '📈', color: '#10b981' },
    { title: 'میانگین عملکرد', value: '4.1 / 5', icon: '⭐', color: '#f59e0b' },
    { title: 'حقوق و دستمزد ماهانه', value: '۶۵۰M', icon: '💰', color: '#6366f1' },
    { title: 'حضور / غیبت', value: '۴.۳% غیبت', icon: '⏱️', color: '#ef4444' },
    { title: 'درخواست‌های در انتظار', value: 27, icon: '📄', color: '#8b5cf6' }
  ];

  // Trend داده‌های منابع انسانی
  hiringTrend = [12, 18, 9, 21, 15, 26, 20];
  attritionTrend = [3, 4, 6, 5, 4, 3, 7];

  // نمودار دونات توزیع عملکرد
  performanceDistribution = [
    { label: 'عالی', value: 12, color: '#10b981' },
    { label: 'خوب', value: 48, color: '#3b82f6' },
    { label: 'قابل‌قبول', value: 72, color: '#f59e0b' },
    { label: 'ضعیف', value: 41, color: '#ef4444' },
    { label: 'خیلی ضعیف', value: 8, color: '#6b7280' }
  ];

  // هزینه حقوق بخش‌ها
  departmentPayroll = [
    { department: 'توسعه', cost: 220 },
    { department: 'فروش', cost: 180 },
    { department: 'پشتیبانی', cost: 140 },
    { department: 'مالی', cost: 90 }
  ];

  // بینش‌های هوشمند
  insights = [
    'بهره‌وری تیم توسعه در این ماه ۱۴٪ افزایش یافته است.',
    'نرخ خروج کارکنان نسبت به ماه گذشته ۱٪ کاهش داشته است.',
    'هزینه حقوق و دستمزد ۵٪ کمتر از میانگین سه‌ماهه است.',
    'درخواست‌های مرخصی امسال ۹٪ افزایش داشته‌اند.',
  ];

  // Funnel استخدام
  recruitmentFunnel = {
    applied: 120,
    screened: 65,
    interview: 28,
    finalInterview: 10,
    hired: 3
  };

  // سلامت واحدها
  departmentsStatus = [
    { name: 'توسعه', staff: 82, score: 4.3, absence: '2.1%', satisfaction: '87%' },
    { name: 'فروش', staff: 41, score: 3.8, absence: '3.5%', satisfaction: '79%' },
    { name: 'پشتیبانی', staff: 57, score: 4.1, absence: '2.8%', satisfaction: '84%' },
    { name: 'مالی', staff: 22, score: 4.6, absence: '1.9%', satisfaction: '89%' }
  ];

}
