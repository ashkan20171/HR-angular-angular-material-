import { Injectable, signal } from '@angular/core';
import { RequestItem } from './request.model';

@Injectable({ providedIn: 'root' })
export class RequestService {

  private key = 'hr_requests';
  requests = signal<RequestItem[]>([]);

  constructor() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      this.requests.set(JSON.parse(saved));
    }
  }

  private save() {
    localStorage.setItem(this.key, JSON.stringify(this.requests()));
  }

  add(req: RequestItem) {
    this.requests.set([req, ...this.requests()]);
    this.save();
  }

  approve(id: number) {
    this.updateStatus(id, 'approved');
  }

  reject(id: number) {
    this.updateStatus(id, 'rejected');
  }

  private updateStatus(id: number, st: any) {
    const list = this.requests().map(r =>
      r.id === id ? { ...r, status: st } : r
    );
    this.requests.set(list);
    this.save();
  }

  getMine(userName: string) {
    return this.requests().filter(r => r.userName === userName);
  }
}
