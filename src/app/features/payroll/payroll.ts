import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SalaryItem {
  month: string;
  base: number;
  overtime: number;
  bonus: number;
  tax: number;
  insurance: number;
  final: number;
}

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payroll.html',
  styleUrl: './payroll.css'
})
export class Payroll {

  // اطلاعات ماه جاری
  current = {
    month: "دی ۱۴۰۳",
    base: 18_000_000,
    overtime: 1_200_000,
    bonus: 500_000,
    tax: 2_100_000,
    insurance: 900_000
  };

  constructor() {}

  get finalSalary() {
    const c = this.current;
    return (c.base + c.overtime + c.bonus) - (c.tax + c.insurance);
  }

  // تاریخچه حقوق
  history: SalaryItem[] = [
    {
      month: "آذر ۱۴۰۳",
      base: 18_000_000,
      overtime: 900_000,
      bonus: 250_000,
      tax: 2_050_000,
      insurance: 900_000,
      final: 16_200_000
    },
    {
      month: "آبان ۱۴۰۳",
      base: 17_500_000,
      overtime: 1_300_000,
      bonus: 0,
      tax: 1_960_000,
      insurance: 870_000,
      final: 15_970_000
    }
  ];

  // خروجی PDF (فعلاً Mock)
  downloadPDF() {
    alert("فیش حقوقی PDF در نسخه نهایی دانلود می‌شود.");
  }
}
