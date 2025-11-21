import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JalaliPipe } from '../../shared/pipes/jalali.pipe';

@Component({
  selector: 'app-payroll',
  standalone: true,
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
  imports: [CommonModule, JalaliPipe]
})
export class Payroll {

  // فیش حقوقی ماه جاری
  currentPayslip = {
    month: 'دی ۱۴۰۳',
    basic: 18_000_000,
    bonus: 3_500_000,
    overtime: 1_200_000,
    insurance: 2_400_000,
    tax: 1_900_000,
    net: 18_400_000
  };

  // سابقه فیش‌ها
  history = [
    { month: 'آذر ۱۴۰۳', net: 17_850_000 },
    { month: 'آبان ۱۴۰۳', net: 17_200_000 },
    { month: 'مهر ۱۴۰۳', net: 16_900_000 }
  ];

  // تبدیل ریال → 3,500,000 تومان
  format(n: number) {
    return n.toLocaleString('fa-IR');
  }

  // دانلود PDF (نسخه تهران–حسابداری رسمی)
  downloadPDF() {
    const content = `
      فیش حقوقی ${this.currentPayslip.month}

      حقوق پایه: ${this.format(this.currentPayslip.basic)}
      مزایا: ${this.format(this.currentPayslip.bonus)}
      اضافه‌کاری: ${this.format(this.currentPayslip.overtime)}
      -------------------------
      بیمه: ${this.format(this.currentPayslip.insurance)}
      مالیات: ${this.format(this.currentPayslip.tax)}
      -------------------------
      خالص پرداختی: ${this.format(this.currentPayslip.net)}
    `;

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip-${this.currentPayslip.month}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  }

}
