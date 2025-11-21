import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryService } from './salary.service';
import { RaiseStatusPipe } from './salary-status.pipe';

@Component({
  selector: 'app-salary',
  standalone: true,
  templateUrl: './salary.html',
  styleUrl: './salary.css',
  imports: [CommonModule, FormsModule, RaiseStatusPipe]
})
export class Salary {

  showModal = false;

  constructor(public salaryService: SalaryService) {}

  newRequest = {
    user: '',
    currentSalary: 0,
    requestedSalary: 0,
    reason: ''
  };

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }

  submit() {
    if (!this.newRequest.user || !this.newRequest.requestedSalary) return;
    this.salaryService.add(this.newRequest);
    this.closeModal();
  }

  changeStatus(id: number, status: any) {
    this.salaryService.updateStatus(id, status);
  }
}
