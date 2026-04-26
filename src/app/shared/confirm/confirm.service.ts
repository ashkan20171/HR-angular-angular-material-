import { Injectable, signal } from '@angular/core';

export type ConfirmKind = 'danger' | 'primary';

export interface ConfirmConfig {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  kind?: ConfirmKind;
}

interface ConfirmState extends Required<ConfirmConfig> {
  _resolve: (v: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private state = signal<ConfirmState | null>(null);

  current = this.state.asReadonly();

  open(config: ConfirmConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.state.set({
        title: config.title ?? 'تأیید',
        message: config.message,
        confirmText: config.confirmText ?? 'تأیید',
        cancelText: config.cancelText ?? 'انصراف',
        kind: config.kind ?? 'primary',
        _resolve: resolve
      });
    });
  }

  confirm() {
    const s = this.state();
    if (!s) return;
    s._resolve(true);
    this.state.set(null);
  }

  cancel() {
    const s = this.state();
    if (!s) return;
    s._resolve(false);
    this.state.set(null);
  }
}
