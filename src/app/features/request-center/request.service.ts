import { Injectable } from '@angular/core';
import { RequestItem, RequestStatus } from './request.types';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private requests: RequestItem[] = [
    {
      id: 1,
      type: 'مرخصی',
      date: '1403/10/23',
      desc: 'نیاز به استراحت',
      status: 'manager-review',
      user: 'علی',
      history: [
        { date: '1403/10/23', action: 'ثبت توسط کاربر', by: 'علی' }
      ]
    },

    {
      id: 2,
      type: 'اضافه‌کاری',
      date: '1403/10/22',
      desc: 'پروژه فوری',
      status: 'accepted',
      user: 'سارا',
      history: [
        { date: '1403/10/22', action: 'ثبت', by: 'سارا' },
        { date: '1403/10/22', action: 'تأیید مدیر', by: 'مدیر' }
      ]
    }
  ];

  getAll() {
    return [...this.requests];
  }

  filter(keyword: string, status: RequestStatus | 'all') {
    return this.requests.filter(r =>
      (status === 'all' || r.status === status) &&
      (
        r.type.includes(keyword) ||
        r.user.includes(keyword) ||
        r.desc.includes(keyword)
      )
    );
  }

  add(request: RequestItem) {
    this.requests.unshift(request);
  }

  updateStatus(id: number, status: RequestStatus, by: string) {
    const rq = this.requests.find(x => x.id === id);
    if (!rq) return;
    rq.status = status;
    rq.history.push({
      date: new Date().toLocaleDateString('fa-IR'),
      action: `تغییر وضعیت به ${status}`,
      by
    });
  }
}
