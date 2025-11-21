import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
  imports: [CommonModule]
})
export class Notifications {

  constructor(public notif: NotificationService) {}

  open(id: number) {
    this.notif.markAsRead(id);
  }

  toggleImportant(id: number) {
    this.notif.toggleImportant(id);
  }
}
