import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from './request.service';

@Component({
  selector: 'app-request-new',
  standalone: true,
  templateUrl: './request-new.html',
  styleUrl: './request-new.css',
  imports: [CommonModule, FormsModule]
})
export class RequestNew {

  model = {
    type: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    amount: 0
  };

  constructor(
    private req: RequestService,
    private router: Router
  ) {}

  submit() {
    const userName = localStorage.getItem('userName') || 'کاربر';

    this.req.add({
      id: Date.now(),
      ...this.model,
      status: 'pending',
      userName,
      createdAt: new Date().toLocaleDateString('fa-IR')
    });

    this.router.navigate(['/requests']);
  }
}
