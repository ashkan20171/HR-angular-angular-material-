import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  createdAt: number;
  durationMs: number;
}

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private items = signal<ToastItem[]>([]);
  toasts = this.items.asReadonly();

  show(message: string, opts?: { type?: ToastType; title?: string; durationMs?: number }) {
    const toast: ToastItem = {
      id: uid(),
      type: opts?.type ?? 'info',
      title: opts?.title,
      message,
      createdAt: Date.now(),
      durationMs: opts?.durationMs ?? 3200,
    };

    this.items.update((prev) => [toast, ...prev].slice(0, 5));

    window.setTimeout(() => {
      this.dismiss(toast.id);
    }, toast.durationMs);
  }

  success(message: string, title?: string) {
    this.show(message, { type: 'success', title });
  }

  error(message: string, title?: string) {
    this.show(message, { type: 'error', title, durationMs: 4500 });
  }

  dismiss(id: string) {
    this.items.update((prev) => prev.filter((t) => t.id !== id));
  }

  clear() {
    this.items.set([]);
  }
}
