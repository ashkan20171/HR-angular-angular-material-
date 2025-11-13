import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leave',
  standalone: true,
  templateUrl: './leave.html',
  styleUrl: './leave.css',
  imports: [CommonModule, FormsModule]
})
export class Leave {

  // اطلاعات کاربر
  leaveInfo = {
    total: 30,
    used: 12,
    remaining: 18,
    lastRequest: {
      type: 'مرخصی استعلاجی',
      date: '۱۴۰۳/۱۰/۱۶',
      status: 'accepted'
    }
  };

  // جدول مرخصی‌ها
  leaves = [
    { type: 'استحقاقی', start: '۱۴۰۳/۱۰/۲۲', end: '۱۴۰۳/۱۰/۲۳', days: 2, status: 'pending', desc: '' },
    { type: 'استعلاجی', start: '۱۴۰۳/۱۰/۱۶', end: '۱۴۰۳/۱۰/۱۶', days: 1, status: 'accepted', desc: 'بیماری' },
    { type: 'بدون حقوق', start: '۱۴۰۳/۰۹/۲۹', end: '۱۴۰۳/۰۹/۳۰', days: 2, status: 'rejected', desc: '' }
  ];

  // Modal
  showModal = false;

  // فرم درخواست جدید
  newLeave = {
    type: '',
    start: '',
    end: '',
    desc: '',
    days: 0
  };

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // محاسبه تعداد روز — نسخه اصلاح‌شده
  calcDays() {
    if (!this.newLeave.start || !this.newLeave.end) {
      this.newLeave.days = 0;
      return;
    }

    const s = new Date(this.newLeave.start);
    const e = new Date(this.newLeave.end);

    const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24) + 1;

    this.newLeave.days = diff > 0 ? diff : 0;
  }

  submitLeave() {
    if (this.newLeave.days <= 0) return;

    this.leaves.unshift({ ...this.newLeave, status: 'pending' });

    this.closeModal();
  }

}
