import { Injectable } from '@angular/core';
import { ChatRoom, Message, ChatUser } from './chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {

  users: ChatUser[] = [
    { id: 1, name: 'Admin', avatar: 'admin.png', role: 'admin', online: true },
    { id: 2, name: 'HR Manager', avatar: 'hr.png', role: 'hr', online: true },
    { id: 3, name: 'Accountant', avatar: 'acc.png', role: 'accounting', online: false, lastSeen: new Date() },
    { id: 4, name: 'Employee', avatar: 'emp.png', role: 'employee', online: true }
  ];

  chats: ChatRoom[] = [
    { id: 1, name: 'گروه منابع انسانی', users: [1, 2, 4], isGroup: true },
    { id: 2, name: 'حسابداری', users: [1, 3], isGroup: false },
    { id: 3, name: 'پشتیبانی کارمندان', users: [1, 4], isGroup: false }
  ];

  messages: Message[] = [];

  constructor() {}

  // ***** مدیریت وضعیت آنلاین و آفلاین *****
  setOnline(userId: number) {
    const u = this.users.find(x => x.id === userId);
    if (u) {
      u.online = true;
    }
  }

  setOffline(userId: number) {
    const u = this.users.find(x => x.id === userId);
    if (u) {
      u.online = false;
      u.lastSeen = new Date();
    }
  }

  getUser(id: number) {
    return this.users.find(u => u.id === id);
  }

  getMessages(chatId: number): Message[] {
    return this.messages.filter(m => m.chatId === chatId);
  }

  private updateChatSummary(chatId: number, content: string) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = content;
      chat.lastMessageTime = new Date();
    }
  }

  sendMessage(chatId: number, senderId: number, text: string) {
    const msg: Message = {
      id: Date.now(),
      chatId,
      senderId,
      text,
      timestamp: new Date()
    };

    this.messages.push(msg);
    this.updateChatSummary(chatId, text);
  }

  sendImage(chatId: number, senderId: number, file: File) {
    const url = URL.createObjectURL(file);

    const msg: Message = {
      id: Date.now(),
      chatId,
      senderId,
      imageUrl: url,
      fileName: file.name,
      timestamp: new Date()
    };

    this.messages.push(msg);
    this.updateChatSummary(chatId, '(📷 تصویر)');
  }

  sendFile(chatId: number, senderId: number, file: File) {
    const url = URL.createObjectURL(file);

    const msg: Message = {
      id: Date.now(),
      chatId,
      senderId,
      fileUrl: url,
      fileName: file.name,
      fileType: file.type,
      timestamp: new Date()
    };

    this.messages.push(msg);
    this.updateChatSummary(chatId, `📎 ${file.name}`);
  }

  sendAudio(chatId: number, senderId: number, audioUrl: string, duration: number) {
    const msg: Message = {
      id: Date.now(),
      chatId,
      senderId,
      audioUrl,
      duration,
      timestamp: new Date()
    };

    this.messages.push(msg);
    this.updateChatSummary(chatId, '(🎤 پیام صوتی)');
  }
}
