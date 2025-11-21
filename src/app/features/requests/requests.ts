import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RequestService } from './request.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  templateUrl: './requests.html',
  styleUrl: './requests.css',
  imports: [CommonModule, RouterModule]
})
export class Requests {

  user = localStorage.getItem('userName') || 'کاربر';

  constructor(
    public req: RequestService,
    private router: Router
  ) {}

  newRequest() {
    this.router.navigate(['/request-new']);
  }

  statusLabel(s: string) {
    return s === 'approved'
      ? 'تأیید شده'
      : s === 'rejected'
      ? 'رد شده'
      : 'در انتظار';
  }
}
