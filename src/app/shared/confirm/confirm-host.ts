import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'app-confirm-host',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('140ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('pop', [
      transition(':enter', [
        style({ transform: 'translateY(10px) scale(0.98)', opacity: 0 }),
        animate('180ms ease-out', style({ transform: 'translateY(0) scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('140ms ease-in', style({ transform: 'translateY(8px) scale(0.98)', opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './confirm-host.html',
  styleUrl: './confirm-host.css'
})
export class ConfirmHost {
  state = computed(() => this.confirm.current());

  constructor(public confirm: ConfirmService) {}

  onBackdrop() {
    this.confirm.cancel();
  }
}
