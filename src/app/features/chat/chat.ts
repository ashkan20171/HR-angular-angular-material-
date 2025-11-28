import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';
import { ChatAiService } from './chat-ai.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {

  selectedChatId: number | null = null;
  inputText = '';

  constructor(
    public chat: ChatService,
    private ai: ChatAiService
  ) {}

  selectChat(id: number) {
    this.selectedChatId = id;
  }

  async send() {
    if (!this.inputText.trim() || !this.selectedChatId) return;

    // پیام کاربر
    this.chat.sendMessage(this.selectedChatId, 1, this.inputText);

    // اگر چت با AI بود
    if (this.selectedChatId === 999) {
      const response = await this.ai.answer(this.inputText);

      this.chat.messages.push({
        id: Date.now() + 1,
        chatId: 999,
        senderId: -1,
        ai: true,
        text: response,
        timestamp: new Date()
      });
    }

    this.inputText = '';
  }
}
