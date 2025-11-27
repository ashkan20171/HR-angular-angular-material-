import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    const rawRows = [
      { title: 'حقوق پایه', amount: 18000000 },
      { title: 'اضافه‌کاری', amount: 2400000 },
      { title: 'حق مسکن', amount: 900000 },
      { title: 'حق بن', amount: 1100000 },
      { title: 'بیمه تأمین اجتماعی', amount: -1700000 },
      { title: 'مالیات', amount: -1300000 }
    ];

    const rows: SalaryRow[] = rawRows.map(r => ({
      ...r,
      type: r.amount >= 0 ? 'plus' : 'minus'
    }));

    const finalSalary = rows.reduce((sum, r) => sum + r.amount, 0);

    this.slip = {
      month: 'دی ۱۴۰۳',
      rows,
      finalSalary
    };
  }

  async downloadPDF() {
    const element = document.getElementById('salary-slip-box');
    if (!element) return;

    const canvas = await html2canvas(element);
    const img = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(img);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('salary-slip.pdf');
  }
}
