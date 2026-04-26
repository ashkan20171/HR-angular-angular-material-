import { Injectable, signal } from '@angular/core';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
  createdAt: number;
  durationMs: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<ToastItem[]>([]);
  private _id = 1;

  toasts = this._toasts.asReadonly();

  show(message: string, opts?: { type?: ToastType; title?: string; durationMs?: number }) {
    const item: ToastItem = {
      id: this._id++,
      type: opts?.type ?? 'info',
      title: opts?.title,
      message,
      createdAt: Date.now(),
      durationMs: opts?.durationMs ?? 3500,
    };

    this._toasts.update(list => [item, ...list].slice(0, 5));

    window.setTimeout(() => this.dismiss(item.id), item.durationMs);
  }

  success(message: string, title?: string) { this.show(message, { type: 'success', title }); }
  error(message: string, title?: string) { this.show(message, { type: 'error', title }); }
  warning(message: string, title?: string) { this.show(message, { type: 'warning', title }); }
  info(message: string, title?: string) { this.show(message, { type: 'info', title }); }

  dismiss(id: number) {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  clear() { this._toasts.set([]); }
}
