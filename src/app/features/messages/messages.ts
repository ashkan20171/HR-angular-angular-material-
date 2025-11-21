import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.html',
  styleUrl: './messages.css',
  imports: [CommonModule]
})
export class Messages {

  user = localStorage.getItem('userName') || 'کاربر';
  list = [];

  constructor(private msg: MessagesService) {
    this.list = this.msg.list(this.user);
  }

  openChat(person: string) {
    console.log('Opening chat with:', person);
  }
}
