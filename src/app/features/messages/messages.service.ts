import { Injectable, signal } from '@angular/core';
import { Message } from './message.model';

@Injectable({ providedIn: 'root' })
export class MessagesService {

  private messages = signal<Message[]>([]);

  constructor() {
    const stored = localStorage.getItem('messages');
    if (stored) this.messages.set(JSON.parse(stored));
  }

  list(user: string) {
    return this.messages().filter(
      m => m.to === user || m.from === user
    );
  }

  send(from: string, to: string, text: string) {
    const m: Message = {
      id: Date.now(),
      from,
      to,
      text,
      time: new Date().toLocaleString('fa-IR'),
      read: false
    };

    this.messages().push(m);
    this.save();
  }

  markRead(id: number) {
    const m = this.messages().find(x => x.id === id);
    if (m) m.read = true;
    this.save();
  }

  save() {
    localStorage.setItem('messages', JSON.stringify(this.messages()));
  }
}
