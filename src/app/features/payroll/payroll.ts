import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Payslip {
  month: string;
  base: number;
  housing: number;
  child: number;
  benefit: number;
  overtime: number;
  absencePenalty: number;
  tax: number;
  insurance: number;
  total: number;
}

@Component({
  selector: 'app-payroll',
  standalone: true,
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
  imports: [CommonModule, FormsModule]
})
export class Payroll {

  // حقوق کارمند
  salary = {
    base: 12000000,         // حقوق پایه
    childCount: 0,          // حق اولاد
    overtimeHours: 0,
    absenceHours: 0
  };

  result: Payslip | null = null;

  // لیست فیش‌های صادر شده
  payslips: Payslip[] = [];

  constructor() {
    const saved = localStorage.getItem('payslips');
    if (saved) this.payslips = JSON.parse(saved);
  }

  calculate() {
    const base = this.salary.base;
    const housing = 900000;    // حق مسکن
    const child = this.salary.childCount * 700000;
    const benefit = 1100000;   // بن کارگری

    const overtime = this.salary.overtimeHours * (base / 220) * 1.4;
    const absencePenalty = this.salary.absenceHours * (base / 220);

    const insurance = base * 0.07;
    const tax = base > 10000000 ? (base - 10000000) * 0.1 : 0;

    const total = base + housing + child + benefit + overtime - absencePenalty - tax - insurance;

    this.result = {
      month: new Date().toLocaleDateString('fa-IR'),
      base,
      housing,
      child,
      benefit,
      overtime: Math.round(overtime),
      absencePenalty: Math.round(absencePenalty),
      insurance: Math.round(insurance),
      tax: Math.round(tax),
      total: Math.round(total)
    };

    this.payslips.unshift(this.result);
    localStorage.setItem('payslips', JSON.stringify(this.payslips));
  }
}
