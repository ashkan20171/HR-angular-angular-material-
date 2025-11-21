import { Injectable, signal } from '@angular/core';

export interface PayrollRecord {
  month: string;
  baseSalary: number;
  overtime: number;
  deductions: number;
  tax: number;
  insurance: number;
  finalPay: number;
}

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private key = 'payroll';
  records = signal<PayrollRecord[]>([]);

  constructor() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      this.records.set(JSON.parse(saved));
    } else {
      // نمونه اولیه
      this.seedData();
    }
  }

  private save() {
    localStorage.setItem(this.key, JSON.stringify(this.records()));
  }

  private seedData() {
    const sample = [
      {
        month: 'دی ۱۴۰۳',
        baseSalary: 15000000,
        overtime: 1200000,
        deductions: 300000,
        tax: 800000,
        insurance: 750000,
        finalPay: 15000000 + 1200000 - 300000 - 800000 - 750000
      },
      {
        month: 'آذر ۱۴۰۳',
        baseSalary: 15000000,
        overtime: 900000,
        deductions: 150000,
        tax: 760000,
        insurance: 750000,
        finalPay: 15000000 + 900000 - 150000 - 760000 - 750000
      }
    ];

    this.records.set(sample);
    this.save();
  }

  latest() {
    return this.records()[0];
  }
}
