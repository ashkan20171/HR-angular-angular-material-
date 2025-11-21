import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestService } from './request.service';
import { RequestItem, RequestStatus } from './request.types';

@Component({
  selector: 'app-request-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-center.html',
  styleUrl: './request-center.css'
})
export class RequestCenter implements OnInit {

  all: RequestItem[] = [];
  filtered: RequestItem[] = [];

  keyword = '';
  status: RequestStatus | 'all' = 'all';

  showModal = false;

  newRequest = {
    type: '',
    desc: ''
  };

  constructor(private requestService: RequestService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.all = this.requestService.getAll();
    this.filtered = this.all;
  }

  search() {
    this.filtered = this.requestService.filter(this.keyword, this.status);
  }

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }

  submitRequest() {
    if (!this.newRequest.type) return;

    const item: RequestItem = {
      id: Date.now(),
      type: this.newRequest.type,
      date: new Date().toLocaleDateString('fa-IR'),
      desc: this.newRequest.desc,
      status: 'pending',
      user: localStorage.getItem('userName') || 'کاربر',
      history: [
        {
          date: new Date().toLocaleDateString('fa-IR'),
          action: 'ثبت درخواست',
          by: localStorage.getItem('userName') || 'کاربر'
        }
      ]
    };

    this.requestService.add(item);
    this.load();
    this.closeModal();

    this.newRequest = { type: '', desc: '' };
  }

}
