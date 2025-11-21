import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AttendanceRecord {
  date: string;
  in: string | null;
  out: string | null;
  workHours: number;
  overtime: number;
  delay: number;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
  imports: [CommonModule]
})
export class Attendance {

  today = new Date().toLocaleDateString('fa-IR');

  punchInTime: string | null = null;
  punchOutTime: string | null = null;

  workedHoursToday = 0;
  overtimeToday = 0;
  delayToday = 0;

  // گزارش ماهانه
  monthRecords: AttendanceRecord[] = [];

  constructor() {
    const saved = localStorage.getItem('attendance');
    if (saved) {
      this.monthRecords = JSON.parse(saved);
    }
  }

  punchIn() {
    if (this.punchInTime) return alert('شما قبلاً ورود زده‌اید!');
    this.punchInTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  }

  punchOut() {
    if (!this.punchInTime) return alert('ابتدا باید ورود ثبت کنید!');
    if (this.punchOutTime) return alert('شما قبلاً خروج زده‌اید!');

    this.punchOutTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    this.calculateWork();
    this.saveRecord();
  }

  calculateWork() {
    const s = this.timeToMinutes(this.punchInTime!);
    const e = this.timeToMinutes(this.punchOutTime!);

    const diff = e - s;
    this.workedHoursToday = +(diff / 60).toFixed(2);

    // 8 ساعت رسمی
    if (diff > 8 * 60) {
      this.overtimeToday = +((diff - 480) / 60).toFixed(2);
    }

    // تأخیر: ورود بعد از ساعت 9 صبح
    if (s > 9 * 60) {
      this.delayToday = +((s - 540) / 60).toFixed(2);
    }
  }

  saveRecord() {
    this.monthRecords.unshift({
      date: this.today,
      in: this.punchInTime,
      out: this.punchOutTime,
      workHours: this.workedHoursToday,
      overtime: this.overtimeToday,
      delay: this.delayToday
    });

    localStorage.setItem('attendance', JSON.stringify(this.monthRecords));
  }

  timeToMinutes(t: string) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

}
