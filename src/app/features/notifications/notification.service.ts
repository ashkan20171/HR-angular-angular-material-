import { Injectable, signal } from '@angular/core';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  important: boolean;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private storeKey = 'notifications';

  notifications = signal<NotificationItem[]>([]);

  constructor() {
    const saved = localStorage.getItem(this.storeKey);
    if (saved) {
      this.notifications.set(JSON.parse(saved));
    } else {
      this.seed();
    }
  }

  private save() {
    localStorage.setItem(this.storeKey, JSON.stringify(this.notifications()));
  }

  // چند اعلان اولیه
  private seed() {
    const demo: NotificationItem[] = [
      {
        id: 1,
        title: 'وضعیت درخواست مرخصی',
        message: 'مرخصی شما تأیید شد.',
        date: '۱۴۰۳/۱۰/۲۳',
        important: false,
        read: false
      },
      {
        id: 2,
        title: 'پیام مهم منابع انسانی',
        message: 'لطفاً پروفایل خود را تکمیل کنید.',
        date: '۱۴۰۳/۱۰/۲۲',
        important: true,
        read: false
      },
      {
        id: 3,
        title: 'پیام سیستم',
        message: 'نسخه جدید پورتال فعال شد.',
        date: '۱۴۰۳/۱۰/۲۰',
        important: false,
        read: true
      }
    ];
    this.notifications.set(demo);
    this.save();
  }

  markAsRead(id: number) {
    const updated = this.notifications().map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications.set(updated);
    this.save();
  }

  toggleImportant(id: number) {
    const updated = this.notifications().map(n =>
      n.id === id ? { ...n, important: !n.important } : n
    );
    this.notifications.set(updated);
    this.save();
  }

  unreadCount() {
    return this.notifications().filter(n => !n.read).length;
  }
}
