import { Injectable } from '@angular/core';

export interface SalaryRequest {
  id: number;
  user: string;
  currentSalary: number;
  requestedSalary: number;
  reason: string;
  date: string;
  status: 'pending' | 'manager' | 'hr' | 'accepted' | 'rejected';
}

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  requests: SalaryRequest[] = [
    {
      id: 1,
      user: 'علی رضایی',
      currentSalary: 18000000,
      requestedSalary: 22000000,
      reason: 'عملکرد عالی فصلی',
      date: '۱۴۰۳/۱۰/۲۰',
      status: 'manager'
    },
    {
      id: 2,
      user: 'مریم رسولی',
      currentSalary: 15000000,
      requestedSalary: 17000000,
      reason: 'افزایش وظایف',
      date: '۱۴۰۳/۱۰/۱۸',
      status: 'pending'
    }
  ];

  constructor() {}

  getAll() {
    return this.requests;
  }

  add(req: Omit<SalaryRequest, 'id' | 'date' | 'status'>) {
    this.requests.unshift({
      id: Math.floor(Math.random() * 99999),
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'pending',
      ...req
    });
  }

  updateStatus(id: number, newStatus: SalaryRequest['status']) {
    const item = this.requests.find(r => r.id === id);
    if (item) item.status = newStatus;
  }

}
