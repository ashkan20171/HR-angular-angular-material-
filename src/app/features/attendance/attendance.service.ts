import { Injectable, signal } from '@angular/core';
import { AttendanceRecord } from './attendance-types';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private key = 'hr_attendance';
  records = signal<AttendanceRecord[]>([]);

  constructor() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      this.records.set(JSON.parse(saved));
    } else {
      this.seed();
    }
  }

  private save() {
    localStorage.setItem(this.key, JSON.stringify(this.records()));
  }

  private seed() {
    const sample: AttendanceRecord[] = [
      { id: 1, date: '1403/10/25', checkIn: '09:05', checkOut: '17:20', workHours: 8.2, status: 'late' },
      { id: 2, date: '1403/10/24', checkIn: '08:59', checkOut: '17:10', workHours: 8.1, status: 'present' },
      { id: 3, date: '1403/10/23', checkIn: '--', checkOut: '--', workHours: 0, status: 'absent' }
    ];
    this.records.set(sample);
    this.save();
  }

  checkIn() {
    const today = this.today();
    const exists = this.records().find(r => r.date === today);
    if (exists) return;

    const now = this.time();
    const status = this.isLate(now) ? 'late' : 'present';

    const newRecord: AttendanceRecord = {
      id: Date.now(),
      date: today,
      checkIn: now,
      checkOut: '--',
      workHours: 0,
      status
    };

    this.records.set([newRecord, ...this.records()]);
    this.save();
  }

  checkOut() {
    const today = this.today();
    const list = this.records().map(r => {
      if (r.date !== today) return r;

      const now = this.time();
      const diff = this.calcWork(r.checkIn, now);

      return { ...r, checkOut: now, workHours: diff };
    });

    this.records.set(list);
    this.save();
  }

  private calcWork(start: string, end: string): number {
    if (start === '--' || end === '--') return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return +(diff / 60).toFixed(2);
  }

  private isLate(time: string): boolean {
    const [h, m] = time.split(':').map(Number);
    return h > 9 || (h === 9 && m > 0);
  }

  private today() {
    return '1403/10/26'; // تست، بعداً تاریخ جلالی واقعی جایگزین می‌کنیم
  }

  private time() {
    const d = new Date();
    return d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  }
}
