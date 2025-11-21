import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from './request.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.html',
  styleUrl: './requests.css'
})
export class Requests {

  constructor(
    public req: RequestService,
    public auth: AuthService
  ) {}

  approve(id: number) {
    if (this.auth.role !== 'admin' && this.auth.role !== 'manager') return;
    this.req.updateStatus(id, 'approved');
  }

  reject(id: number) {
    if (this.auth.role !== 'admin' && this.auth.role !== 'manager') return;
    this.req.updateStatus(id, 'rejected');
  }
}
