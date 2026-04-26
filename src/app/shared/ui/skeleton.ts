import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="sk" [style.width]="width" [style.height]="height" [style.borderRadius]="radius"></div>`,
  styles: [
    `.sk{position:relative; overflow:hidden; background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.06);}`,
    `.sk::after{content:''; position:absolute; inset:0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent); animation: shimmer 1.1s infinite;}`,
    `@keyframes shimmer{to{transform: translateX(100%)}}`
  ]
})
export class Skeleton {
  @Input() width: string = '100%';
  @Input() height: string = '14px';
  @Input() radius: string = '12px';
}
