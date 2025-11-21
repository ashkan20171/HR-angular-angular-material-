import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollService } from './payroll.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-payroll',
  standalone: true,
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
  imports: [CommonModule, RouterModule]
})
export class Payroll {

  constructor(
    public pay: PayrollService,
    private router: Router
  ) {}

  openSlip(id: number) {
    this.router.navigate(['/salary-slip', id]);
  }
}
