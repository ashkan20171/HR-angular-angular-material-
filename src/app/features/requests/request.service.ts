import { Injectable } from '@angular/core';

export interface HRRequest {
  id: number;
  user: string;
  type: string;
  date: string;
  desc: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private requests: HRRequest[] = [
    { id: 1, user: 'علی', type: 'leave', date: '۱۴۰۳/۱۰/۲۲', desc: '', status: 'pending' },
    { id: 2, user: 'مریم', type: 'mission', date: '۱۴۰۳/۱۰/۱۸', desc: 'جلسه', status: 'manager-approved' }
  ];

  getRequests() {
    return this.requests;
  }

  addRequest(req: HRRequest) {
    this.requests.unshift(req);
  }

  updateStatus(id: number, status: string) {
    const req = this.requests.find(r => r.id === id);
    if (req) req.status = status;
  }

}
