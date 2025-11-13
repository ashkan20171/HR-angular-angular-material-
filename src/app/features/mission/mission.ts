import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission',
  standalone: true,
  templateUrl: './mission.html',
  styleUrl: './mission.css',
  imports: [CommonModule, FormsModule]
})
export class Mission {

  showModal = false;

  missionList = [
    { start: '۱۴۰۳/۰۸/۲۰', end: '۱۴۰۳/۰۸/۲۲', type: 'خارج از شهر', place: 'اصفهان', days: 2, status: 'pending' },
    { start: '۱۴۰۳/۰۷/۱۰', end: '۱۴۰۳/۰۷/۱۲', type: 'داخلی', place: 'تهران', days: 2, status: 'accepted' },
    { start: '۱۴۰۳/۰۶/۲۵', end: '۱۴۰۳/۰۶/۲۵', type: 'داخلی', place: 'کرج', days: 1, status: 'rejected' }
  ];

  form = {
    start: '',
    end: '',
    type: 'داخلی',
    place: '',
    reason: ''
  };

  openNew() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  getDays(start: string, end: string) {
    return 2; // موقت، بعداً با تاریخ شمسی واقعی محاسبه می‌کنیم
  }

  submit() {
    if (!this.form.start || !this.form.end || !this.form.place) return;

    const days = this.getDays(this.form.start, this.form.end);

    this.missionList.unshift({
      start: this.form.start,
      end: this.form.end,
      type: this.form.type,
      place: this.form.place,
      days,
      status: 'pending'
    });

    this.closeModal();
  }
}
