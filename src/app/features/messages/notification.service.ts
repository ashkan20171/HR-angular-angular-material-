import { Injectable, signal } from '@angular/core';
import { Notification } from './notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private notifications = signal<Notification[]>([]);

  constructor() {
    const stored = localStorage.getItem('notifications');
    if (stored) this.notifications.set(JSON.parse(stored));
  }

  list() {
    return this.notifications();
  }

  add(text: string, type: Notification['type'] = 'info') {
    const n: Notification = {
      id: Date.now(),
      text,
      type,
      created: new Date().toLocaleString('fa-IR'),
      read: false
    };

    this.notifications().unshift(n);
    this.save();
  }

  markRead(id: number) {
    const list = this.notifications();
    const item = list.find(n => n.id === id);
    if (item) item.read = true;
    this.save();
  }

  unreadCount() {
    return this.notifications().filter(n => !n.read).length;
  }

  save() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications()));
  }
}
