import { Injectable, signal } from '@angular/core';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifs = signal<NotificationItem[]>([]);

  constructor() {
    const saved = localStorage.getItem('notifs');
    if (saved) {
      this.notifs.set(JSON.parse(saved));
    }
  }

  getAll() {
    return this.notifs();
  }

  add(notification: Omit<NotificationItem, 'id' | 'date' | 'read'>) {
    const newNotif: NotificationItem = {
      id: Date.now(),
      date: new Date().toLocaleString('fa-IR'),
      read: false,
      ...notification
    };

    this.notifs.update(n => [newNotif, ...n]);
    this.save();
  }

  markAsRead(id: number) {
    this.notifs.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
    this.save();
  }

  unreadCount() {
    return this.notifs().filter(n => !n.read).length;
  }

  private save() {
    localStorage.setItem('notifs', JSON.stringify(this.notifs()));
  }

}
