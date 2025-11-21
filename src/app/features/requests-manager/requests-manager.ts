import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from '../requests/request.service';
import { RequestItem } from '../requests/request.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requests-manager',
  standalone: true,
  templateUrl: './requests-manager.html',
  styleUrl: './requests-manager.css',
  imports: [CommonModule, FormsModule]
})
export class RequestsManager {

  filterType = '';
  filterStatus = '';
  search = '';

  constructor(public req: RequestService) {}

  get all(): RequestItem[] {
    return this.req.requests().filter(r =>
      (this.filterType ? r.type === this.filterType : true) &&
      (this.filterStatus ? r.status === this.filterStatus : true) &&
      (this.search ? r.userName.includes(this.search) || r.title.includes(this.search) : true)
    );
  }

  approve(id: number) {
    this.req.approve(id);
  }

  reject(id: number) {
    const msg = prompt('دلیل رد کردن را وارد کنید:');
    this.req.reject(id);
  }
}
