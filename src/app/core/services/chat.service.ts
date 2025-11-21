import { Injectable, signal } from '@angular/core';

export interface Conversation {
  id: number;
  title: string;
  participants: string[];  // ['Ashkan', 'HR Manager']
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  from: string;
  text: string;
  time: string;
  seen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private conversationsSignal = signal<Conversation[]>([]);
  private messagesSignal = signal<ChatMessage[]>([]);

  constructor() {
    const convs = localStorage.getItem('chat_conversations');
    const msgs  = localStorage.getItem('chat_messages');

    if (convs) this.conversationsSignal.set(JSON.parse(convs));
    if (msgs)  this.messagesSignal.set(JSON.parse(msgs));

    // اگر چیزی نیست، یک نمونه اولیه بسازیم
    if (!convs || !msgs) {
      this.seedData();
    }
  }

  private seedData() {
    const user = localStorage.getItem('userName') || 'اشکان';

    const convs: Conversation[] = [
      {
        id: 1,
        title: 'گفتگو با مدیریت منابع انسانی',
        participants: [user, 'مدیر منابع انسانی'],
        lastMessageAt: new Date().toLocaleString('fa-IR'),
        unreadCount: 1
      },
      {
        id: 2,
        title: 'تیم توسعه محصول',
        participants: [user, 'لیلا', 'علی', 'سارا'],
        lastMessageAt: new Date().toLocaleString('fa-IR'),
        unreadCount: 0
      }
    ];

    const msgs: ChatMessage[] = [
      {
        id: 1,
        conversationId: 1,
        from: 'مدیر منابع انسانی',
        text: 'سلام اشکان، گزارش عملکرد این ماهت عالی بوده 👏',
        time: new Date().toLocaleString('fa-IR'),
        seen: false
      },
      {
        id: 2,
        conversationId: 2,
        from: 'لیلا',
        text: 'جلسه فردا ساعت ۱۰ برای بررسی فیچر جدید فراموش نشه.',
        time: new Date().toLocaleString('fa-IR'),
        seen: true
      }
    ];

    this.conversationsSignal.set(convs);
    this.messagesSignal.set(msgs);
    this.persist();
  }

  private persist() {
    localStorage.setItem('chat_conversations', JSON.stringify(this.conversationsSignal()));
    localStorage.setItem('chat_messages', JSON.stringify(this.messagesSignal()));
  }

  getConversations() {
    return this.conversationsSignal();
  }

  getMessages(conversationId: number) {
    return this.messagesSignal().filter(m => m.conversationId === conversationId);
  }

  getConversationById(id: number) {
    return this.conversationsSignal().find(c => c.id === id) || null;
  }

  sendMessage(conversationId: number, from: string, text: string) {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      conversationId,
      from,
      text: text.trim(),
      time: new Date().toLocaleString('fa-IR'),
      seen: false
    };

    const msgs = this.messagesSignal();
    msgs.push(newMsg);
    this.messagesSignal.set(msgs);

    const convs = this.conversationsSignal().map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessageAt: newMsg.time,
          // فرض: دریافت‌کننده کسی غیر از فرستنده است → یک unread
          unreadCount: c.unreadCount + 1
        };
      }
      return c;
    });
    this.conversationsSignal.set(convs);

    this.persist();
  }

  markConversationRead(conversationId: number) {
    const msgs = this.messagesSignal().map(m =>
      m.conversationId === conversationId ? { ...m, seen: true } : m
    );
    this.messagesSignal.set(msgs);

    const convs = this.conversationsSignal().map(c =>
      c.id === conversationId ? { ...c, unreadCount: 0 } : c
    );
    this.conversationsSignal.set(convs);

    this.persist();
  }
}
