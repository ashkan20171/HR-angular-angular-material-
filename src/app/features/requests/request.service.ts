import { Injectable, signal } from '@angular/core';
import { HRRequest } from './request-types';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private key = 'hr_requests';
  requests = signal<HRRequest[]>([]);

  constructor() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      this.requests.set(JSON.parse(saved));
    } else {
      this.seed();
    }
  }

  private save() {
    localStorage.setItem(this.key, JSON.stringify(this.requests()));
  }

  private seed() {
    const sample: HRRequest[] = [
      {
        id: 1,
        type: 'مرخصی',
        createdAt: '۱۴۰۳/۱۰/۲۵',
        user: 'علی رضایی',
        details: 'مرخصی استحقاقی',
        status: 'pending'
      },
      {
        id: 2,
        type: 'اضافه‌کاری',
        createdAt: '۱۴۰۳/۱۰/۲۴',
        user: 'سارا محمدی',
        details: '۳ ساعت اضافه‌کاری',
        status: 'approved'
      }
    ];

    this.requests.set(sample);
    this.save();
  }

  add(req: HRRequest) {
    const list = this.requests();
    req.id = list.length ? list[list.length - 1].id + 1 : 1;

    this.requests.set([req, ...list]);
    this.save();
  }

  updateStatus(id: number, status: 'approved' | 'rejected') {
    const list = this.requests().map(r =>
      r.id === id ? { ...r, status } : r
    );

    this.requests.set(list);
    this.save();
  }
}
