import { Injectable, signal } from '@angular/core';

export interface AttendanceRecord {
  date: string;
  checkIn?: string;
  checkOut?: string;
  hours?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private key = 'attendance';
  records = signal<AttendanceRecord[]>([]);

  constructor() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      this.records.set(JSON.parse(saved));
    }
  }

  private save() {
    localStorage.setItem(this.key, JSON.stringify(this.records()));
  }

  checkIn() {
    const today = this.today();
    const list = this.records();

    const exist = list.find(r => r.date === today);
    if (exist) return;

    list.unshift({
      date: today,
      checkIn: this.timeNow()
    });

    this.records.set(list);
    this.save();
  }

  checkOut() {
    const today = this.today();
    const list = this.records();

    const r = list.find(r => r.date === today);
    if (!r || r.checkOut) return;

    r.checkOut = this.timeNow();
    r.hours = this.calcHours(r.checkIn!, r.checkOut);

    this.records.set([...list]);
    this.save();
  }

  private timeNow() {
    return new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  }

  private today() {
    return new Date().toLocaleDateString('fa-IR');
  }

  private calcHours(start: string, end: string): number {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    const diff = endMin - startMin;
    return +(diff / 60).toFixed(2);
  }

  totalHoursThisMonth(): number {
    return this.records().reduce((sum, r) => sum + (r.hours || 0), 0);
  }
}
