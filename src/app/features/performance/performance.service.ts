import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PerformanceService {

  getEmployeeSummary() {
    return {
      name: 'اشکان رضایی',
      position: 'کارشناس منابع انسانی'
    };
  }

  getRadarData() {
    return {
      labels: ['تعهد', 'تیم‌ورک', 'سرعت', 'کیفیت', 'خلاقیت'],
      values: [80, 65, 90, 70, 85]
    };
  }

  getKpis() {
    return [
      { title: 'تعهد سازمانی', value: 80 },
      { title: 'تکمیل وظایف', value: 95 },
      { title: 'رعایت قوانین', value: 88 },
      { title: 'کار تیمی', value: 78 },
      { title: 'خلاقیت', value: 85 }
    ];
  }

  getFeedback() {
    return [
      {
        text: 'عملکرد کلی بسیار خوب بوده است و همکاری بالایی با تیم داشته‌اید.',
        by: 'مدیر مستقیم',
        date: '۱۴۰۳/۰۸/۱۲'
      }
    ];
  }
}
