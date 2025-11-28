import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatAiService } from './chat-ai.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  imports: [CommonModule, FormsModule]
})
export class Chat {

  selectedChatId: number | null = null;
  messageText = '';

  recorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  recording = false;

  constructor(public chat: ChatService, private ai: ChatAiService) {}

  selectChat(id: number) {
    this.selectedChatId = id;
  }

  async startRecording() {
    if (!navigator.mediaDevices) {
      alert('مرورگر شما ضبط صدا را پشتیبانی نمی‌کند.');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.audioChunks = [];
    this.recorder = new MediaRecorder(stream);

    this.recorder.start();
    this.recording = true;

    this.recorder.ondataavailable = (e) => {
      this.audioChunks.push(e.data);
    };

    this.recorder.onstop = () => {
      const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);

      const audioElement = new Audio(url);
      audioElement.onloadedmetadata = () => {
        const duration = audioElement.duration;

        if (this.selectedChatId) {
          this.chat.sendAudio(this.selectedChatId, 1, url, duration);
        }
      };
    };
  }

  stopRecording() {
    this.recorder.stop();
    this.recording = false;
  }

  async send() {
    if (!this.selectedChatId || !this.messageText.trim()) return;

    this.chat.sendMessage(this.selectedChatId, 1, this.messageText);

    if (this.selectedChatId === 999) {
      const aiReply = await this.ai.answer(this.messageText);

      this.chat.messages.push({
        id: Date.now() + 1,
        chatId: 999,
        senderId: -1,
        ai: true,
        text: aiReply,
        timestamp: new Date()
      });
    }

    this.messageText = '';
  }

  sendImage(files: FileList | null) {
    if (!files || !files[0] || !this.selectedChatId) return;
    this.chat.sendImage(this.selectedChatId, 1, files[0]);
  }

  sendFile(files: FileList | null) {
    if (!files || !files[0] || !this.selectedChatId) return;
    this.chat.sendFile(this.selectedChatId, 1, files[0]);
  }
}
