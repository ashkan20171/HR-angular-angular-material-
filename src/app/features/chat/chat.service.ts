import { Injectable } from '@angular/core';
import { ChatRoom, Message, ChatUser } from './chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  users: ChatUser[] = [
    { id: 1, name: 'Admin', avatar: 'admin.png', role: 'admin', online: true },
    { id: 2, name: 'HR Manager', avatar: 'hr.png', role: 'hr', online: true },
    { id: 3, name: 'Accountant', avatar: 'acc.png', role: 'accounting', online: false },
    { id: 4, name: 'Employee', avatar: 'emp.png', role: 'employee', online: true }
  ];

  chats: ChatRoom[] = [
    { id: 1, name: 'گروه منابع انسانی', users: [1,2,4], isGroup: true },
    { id: 2, name: 'چت مدیرمالی', users: [1,3], isGroup: false },
    { id: 3, name: 'چت کارمند', users: [1,4], isGroup: false }
  ];

  messages: Message[] = [];

  // گرفتن پیام‌ها
  getMessages(chatId: number): Message[] {
    return this.messages.filter(m => m.chatId === chatId);
  }

  // ارسال پیام
  sendMessage(chatId: number, senderId: number, text: string) {
    const msg: Message = {
      id: Date.now(),
      chatId,
      senderId,
      text,
      timestamp: new Date()
    };
    this.messages.push(msg);
  }
}
