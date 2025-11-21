import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SalaryRow {
  title: string;
  amount: number;
  type: 'plus' | 'minus';
}

interface SalarySlipModel {
  month: string;
  rows: SalaryRow[];
  finalSalary: number;
}

@Component({
  selector: 'app-salary-slip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salary-slip.html',
  styleUrl: './salary-slip.css'
})
export class SalarySlip {

  userName = localStorage.getItem('userName') || '---';

  slip: SalarySlipModel;

  constructor() {

    // ورودی خام بدون type
    const rawRows = [
      { title: 'حقوق پایه', amount: 18000000 },
      { title: 'اضافه‌کاری', amount: 2400000 },
      { title: 'حق مسکن', amount: 900000 },
      { title: 'حق بن', amount: 1100000 },
      { title: 'بیمه تأمین اجتماعی', amount: -1700000 },
      { title: 'مالیات', amount: -1300000 }
    ];

    // تبدیل ورودی خام به مدل حقوقی استاندارد
    const rows: SalaryRow[] = rawRows.map(r => ({
      ...r,
      type: r.amount >= 0 ? 'plus' : 'minus'
    }));

    // محاسبه حقوق نهایی
    const finalSalary =
      rows.reduce((sum, r) => sum + r.amount, 0);

    this.slip = {
      month: 'دی ۱۴۰۳',
      rows,
      finalSalary
    };
  }

}
