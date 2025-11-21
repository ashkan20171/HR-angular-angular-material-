import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Conversation, ChatMessage } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  imports: [CommonModule, FormsModule]
})
export class Chat {

  currentUser = localStorage.getItem('userName') || 'اشکان';

  conversations: Conversation[] = [];
  messages: ChatMessage[] = [];
  selectedConv: Conversation | null = null;

  newMessageText = '';

  constructor(private chat: ChatService) {
    this.conversations = this.chat.getConversations();
  }

  selectConversation(conv: Conversation) {
    this.selectedConv = conv;
    this.messages = this.chat.getMessages(conv.id);
    this.chat.markConversationRead(conv.id);
  }

  isMine(msg: ChatMessage) {
    return msg.from === this.currentUser;
  }

  send() {
    if (!this.selectedConv) return;
    if (!this.newMessageText.trim()) return;

    this.chat.sendMessage(this.selectedConv.id, this.currentUser, this.newMessageText);

    this.messages = this.chat.getMessages(this.selectedConv.id);
    this.newMessageText = '';
  }
}
