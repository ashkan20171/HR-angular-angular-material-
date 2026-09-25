import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesService } from './messages.service';
import { Message } from './message.model';

@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.html',
  styleUrl: './messages.css',
  imports: [CommonModule]
})
export class Messages {

  user = 'کاربر';
  list: Message[] = [];

  constructor(private msg: MessagesService) {
    if (typeof localStorage !== 'undefined') {
      this.user = localStorage.getItem('userName') || 'کاربر';
    }
    this.list = this.msg.list(this.user);
  }

  openChat(person: string) {
    console.log('Opening chat with:', person);
  }
}
