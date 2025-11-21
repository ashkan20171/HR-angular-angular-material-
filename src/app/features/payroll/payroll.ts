import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollService } from './payroll.service';

@Component({
  selector: 'app-payroll',
  standalone: true,
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
  imports: [CommonModule]
})
export class Payroll {

  constructor(public payroll: PayrollService) {}
}
