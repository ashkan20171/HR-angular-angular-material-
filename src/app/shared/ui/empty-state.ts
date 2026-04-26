import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="empty">
    <div class="badge">✨</div>
    <div class="title">{{ title }}</div>
    <div class="msg">{{ message }}</div>
    <button *ngIf="actionLabel" class="btn" (click)="action.emit()">{{ actionLabel }}</button>
  </div>
  `,
  styles: [
    `.empty{padding:26px; border-radius:18px; border:1px dashed rgba(255,255,255,.18); background: rgba(255,255,255,.04); display:grid; justify-items:center; text-align:center; gap:10px}`,
    `.badge{width:44px;height:44px;border-radius:16px; display:grid; place-items:center; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.10)}`,
    `.title{font-weight:800; font-size:16px}`,
    `.msg{opacity:.85; font-size:13px; line-height:1.5; max-width: 48ch}`,
    `.btn{border:none; cursor:pointer; padding:10px 12px; border-radius:14px; background: rgba(79, 70, 229, .9); color:#fff; font-weight:700}`,
    `.btn:hover{filter: brightness(1.05)}`
  ]
})
export class EmptyState {
  @Input() title: string = 'موردی یافت نشد';
  @Input() message: string = 'هنوز داده‌ای ثبت نشده. برای شروع، یک مورد جدید ایجاد کنید.';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
