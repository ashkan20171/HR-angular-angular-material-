import { Injectable, signal } from '@angular/core';

export interface ModalAction {
  label: string;
  kind?: 'primary' | 'danger' | 'ghost';
  value: any;
}

export interface ModalState {
  open: boolean;
  title?: string;
  body?: string; // HTML-safe plain string (rendered as text)
  actions: ModalAction[];
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private _state = signal<ModalState>({ open: false, actions: [] });
  state = this._state.asReadonly();

  open(opts: { title: string; body: string; actions?: ModalAction[] }) {
    this._state.set({
      open: true,
      title: opts.title,
      body: opts.body,
      actions: opts.actions ?? [{ label: 'باشه', kind: 'primary', value: true }],
    });
  }

  close() {
    this._state.set({ open: false, actions: [] });
  }

  async confirm(opts: { title: string; body: string; confirmText?: string; cancelText?: string; danger?: boolean }): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._state.set({
        open: true,
        title: opts.title,
        body: opts.body,
        actions: [
          { label: opts.cancelText ?? 'انصراف', kind: 'ghost', value: false },
          { label: opts.confirmText ?? 'تایید', kind: opts.danger ? 'danger' : 'primary', value: true },
        ],
      });

      // one-shot handler stored on window (simple, keeps code small)
      (window as any).__ashkan_modal_resolve__ = (val: boolean) => resolve(val);
    });
  }

  _resolve(val: any) {
    try {
      const fn = (window as any).__ashkan_modal_resolve__;
      if (typeof fn === 'function') fn(val);
    } finally {
      (window as any).__ashkan_modal_resolve__ = null;
      this.close();
    }
  }
}
