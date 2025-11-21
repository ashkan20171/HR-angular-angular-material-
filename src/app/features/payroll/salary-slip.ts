import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salary-slip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salary-slip.html',
  styleUrl: './salary-slip.css'
})
export class SalarySlip {

  userName = localStorage.getItem('userName') || '---';

  slip = {
    month: 'دی ۱۴۰۳',
    rows: [
      { title: 'حقوق پایه', amount: 18000000, type: 'plus' },
      { title: 'اضافه‌کاری', amount: 2400000, type: 'plus' },
      { title: 'حق مسکن', amount: 900000, type: 'plus' },
      { title: 'حق بن', amount: 1100000, type: 'plus' },

      { title: 'بیمه تأمین اجتماعی', amount: -1700000, type: 'minus' },
      { title: 'مالیات', amount: -1300000, type: 'minus' }
    ],
    finalSalary: 23000000
  };

}
