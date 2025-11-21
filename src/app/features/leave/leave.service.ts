import { Injectable } from '@angular/core';

export interface LeaveItem {
  type: string;
  start: string;
  end: string;
  days: number;
  desc: string;
  status: 'pending' | 'accepted' | 'rejected';
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private leaves: LeaveItem[] = [
    { type: 'استحقاقی', start: '1403/10/20', end: '1403/10/22', days: 3, desc: '', status: 'pending' },
    { type: 'استعلاجی', start: '1403/09/28', end: '1403/09/29', days: 2, desc: 'سرماخوردگی', status: 'accepted' }
  ];

  getSummary() {
    const total = 30;
    const used = this.leaves.reduce((sum, l) => sum + l.days, 0);
    return {
      total,
      used,
      remaining: total - used,
      last: this.leaves[0]
    };
  }

  getLeaves() {
    return [...this.leaves];
  }

  calculateDays(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const diff = ((e as any) - (s as any)) / (1000 * 3600 * 24) + 1;
    return diff > 0 ? diff : 0;
  }

  addLeave(item: any) {
    this.leaves.unshift({ ...item, status: "pending" });
  }
}
