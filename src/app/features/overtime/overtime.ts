import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-overtime',
  standalone: true,
  templateUrl: './overtime.html',
  styleUrl: './overtime.css',
  imports: [CommonModule, FormsModule]
})
export class Overtime {

  showModal = false;

  overtimeList = [
    { date: '۱۴۰۳/۰۸/۲۱', start: '18:00', end: '21:00', hours: 3, status: 'pending' },
    { date: '۱۴۰۳/۰۸/۲۰', start: '17:00', end: '20:00', hours: 3, status: 'accepted' },
    { date: '۱۴۰۳/۰۸/۱۸', start: '19:00', end: '22:30', hours: 3.5, status: 'rejected' }
  ];

  // فرم
  form = {
    date: '',
    start: '',
    end: '',
    reason: ''
  };

  getTotalThisMonth() {
    return this.overtimeList.reduce((sum, x) => sum + x.hours, 0);
  }

  openNew() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submit() {
    if (!this.form.date || !this.form.start || !this.form.end) return;

    const start = Number(this.form.start.replace(':', '.'));
    const end = Number(this.form.end.replace(':', '.'));
    const hours = end - start;

    this.overtimeList.unshift({
      date: this.form.date,
      start: this.form.start,
      end: this.form.end,
      hours,
      status: 'pending'
    });

    this.closeModal();
  }
}
