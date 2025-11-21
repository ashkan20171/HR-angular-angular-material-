import { Injectable } from '@angular/core';

export interface Review {
  id: number;
  employee: string;
  period: string;
  score: number;
  desc: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private reviews: Review[] = [
    { id: 1, employee: 'علی رضایی', period: 'زمستان ۱۴۰۳', score: 92, desc: '' },
    { id: 2, employee: 'مریم کاظمی', period: 'پاییز ۱۴۰۳', score: 78, desc: '' },
    { id: 3, employee: 'سارا محمدی', period: 'تابستان ۱۴۰۳', score: 65, desc: '' }
  ];

  getAll() {
    return [...this.reviews];
  }

  getOne(id: number) {
    return this.reviews.find(r => r.id === id)!;
  }

  add(item: Review) {
    item.id = Date.now();
    this.reviews.unshift(item);
  }

  update(item: Review) {
    const i = this.reviews.findIndex(r => r.id === item.id);
    if (i !== -1) this.reviews[i] = item;
  }

  remove(id: number) {
    this.reviews = this.reviews.filter(r => r.id !== id);
  }

}
