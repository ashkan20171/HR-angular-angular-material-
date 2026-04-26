import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css'
})
export class ToastContainer {
  toasts = computed(() => this.toast.toasts());

  constructor(public toast: ToastService) {}

  icon(type: ToastType) {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '⛔';
      default: return 'ℹ️';
    }
  }
}
