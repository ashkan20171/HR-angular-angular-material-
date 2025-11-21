import { Injectable, signal } from '@angular/core';
import { PayrollRecord, SalaryRow } from './payroll.model';

@Injectable({ providedIn: 'root' })
export class PayrollService {

  private key = 'hr_payroll';
  payroll = signal<PayrollRecord[]>([]);

  constructor() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      this.payroll.set(JSON.parse(saved));
    } else {
      this.seed();
    }
  }

  private save() {
    localStorage.setItem(this.key, JSON.stringify(this.payroll()));
  }

  private seed() {
    const sample: PayrollRecord[] = [
      {
        id: 1,
        month: 'دی ۱۴۰۳',
        baseSalary: 18000000,
        rows: [
          { title: 'حق مسکن', amount: 900000, type: 'plus' },
          { title: 'بن کارگری', amount: 1100000, type: 'plus' },
          { title: 'بیمه تأمین اجتماعی', amount: 1300000, type: 'minus' }
        ],
        finalSalary: 18000000 + 900000 + 1100000 - 1300000
      }
    ];

    this.payroll.set(sample);
    this.save();
  }

  getRecord(id: number) {
    return this.payroll().find(p => p.id === id) || null;
  }

  addRecord(record: PayrollRecord) {
    this.payroll.set([...this.payroll(), record]);
    this.save();
  }
}
