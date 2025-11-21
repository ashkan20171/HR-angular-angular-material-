import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveStatusPipe } from '../../shared/pipes/leave-status.pipe';
import { JalaliPipe } from '../../shared/pipes/jalali.pipe';

@Component({
  selector: 'app-requests',
  standalone: true,
  templateUrl: './requests.html',
  styleUrl: './requests.css',
  imports: [
    CommonModule,
    FormsModule,
    LeaveStatusPipe,
    JalaliPipe
  ]
})
export class Requests {

  // فیلترها
  filter = {
    type: '',
    status: '',
    search: ''
  };

  // نمایش مودال
  showModal = false;

  // دیتای نمونه
  requests = [
    { id: 1, type: 'مرخصی', date: '2025-01-10', status: 'pending', desc: 'مرخصی دو روزه' },
    { id: 2, type: 'ماموریت', date: '2025-01-08', status: 'accepted', desc: 'ماموریت تهران' },
    { id: 3, type: 'اضافه‌کاری', date: '2025-01-05', status: 'rejected', desc: 'درخواست اضافه‌کاری آخر هفته' }
  ];

  // مدل درخواست جدید
  newReq = {
    type: '',
    date: '',
    desc: ''
  };

  // باز کردن مودال
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ارسال درخواست
  submit() {

    if (!this.newReq.type || !this.newReq.date) return;

    this.requests.unshift({
      id: Date.now(),
      type: this.newReq.type,
      date: this.newReq.date,
      status: 'pending',
      desc: this.newReq.desc
    });

    this.newReq = { type: '', date: '', desc: '' };
    this.closeModal();
  }

  // فیلتر جدول
  filtered() {
    return this.requests.filter(r =>

      (!this.filter.type || r.type === this.filter.type) &&
      (!this.filter.status || r.status === this.filter.status) &&
      (!this.filter.search || r.desc.includes(this.filter.search))
    );
  }

}
