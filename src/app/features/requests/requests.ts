import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { RequestService, HRRequest } from './request.service';
import { RequestTypePipe } from './request-type.pipe';
import { RequestStatusPipe } from './request-status.pipe';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule,RequestTypePipe,
    RequestStatusPipe],
  templateUrl: './requests.html',
  styleUrl: './requests.css'
})
export class Requests {

  constructor(
    public auth: AuthService,
    private requestService: RequestService
  ) {}

  filter = '';
  typeFilter = 'all';

  // دریافت همه درخواست‌ها
  get list(): HRRequest[] {
    return this.requestService.getRequests().filter(r => {
      const matchesText = r.user.toLowerCase().includes(this.filter.toLowerCase());
      const matchesType = (this.typeFilter === 'all' || this.typeFilter === r.type);
      return matchesText && matchesType;
    });
  }

  // باز کردن فرم مودال
  showModal = false;
  newRequest = {
    type: '',
    date: '',
    desc: ''
  };

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ثبت درخواست
  submitRequest() {
    if (!this.newRequest.type || !this.newRequest.date) return;

    this.requestService.addRequest({
      id: Date.now(),
      user: localStorage.getItem('userName') || 'ناشناس',
      type: this.newRequest.type,
      date: this.newRequest.date,
      desc: this.newRequest.desc || '',
      status: 'pending'
    });

    this.closeModal();
  }

  // تأیید مدیر
  approve(id: number) {
    this.requestService.updateStatus(id, 'manager-approved');
  }

  // تایید HR
  hrApprove(id: number) {
    this.requestService.updateStatus(id, 'hr-approved');
  }

  // رد
  reject(id: number) {
    this.requestService.updateStatus(id, 'rejected');
  }

}
