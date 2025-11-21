import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService, LeaveItem } from './leave.service';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave.html',
  styleUrl: './leave.css'
})
export class Leave implements OnInit {

  summary: any;
  leaves: LeaveItem[] = [];
  showModal = false;

  newLeave = {
    type: '',
    start: '',
    end: '',
    desc: '',
    days: 0
  };

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.summary = this.leaveService.getSummary();
    this.leaves = this.leaveService.getLeaves();
  }

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }

  calcDays() {
    if (!this.newLeave.start || !this.newLeave.end) return;

    this.newLeave.days = this.leaveService.calculateDays(
      this.newLeave.start,
      this.newLeave.end
    );
  }

  submitLeave() {
    if (this.newLeave.days <= 0 || !this.newLeave.type) return;

    this.leaveService.addLeave(this.newLeave);
    
    this.leaves = this.leaveService.getLeaves();
    this.summary = this.leaveService.getSummary();

    this.newLeave = { type: '', start: '', end: '', desc: '', days: 0 };
    this.closeModal();
  }
}
