import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-host.html',
  styleUrl: './toast-host.css'
})
export class ToastHost {
  constructor(public toast: ToastService) {}
  dismiss(id: number) { this.toast.dismiss(id); }
}
