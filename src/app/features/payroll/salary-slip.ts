import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PayrollService } from './payroll.service';

@Component({
  selector: 'app-salary-slip',
  standalone: true,
  templateUrl: './salary-slip.html',
  styleUrl: './salary-slip.css',
  imports: [CommonModule]
})
export class SalarySlip {

  slip: any = null;

  constructor(
    private route: ActivatedRoute,
    private pay: PayrollService
  ) {
    const id = Number(this.route.snapshot.params['id']);
    this.slip = this.pay.getRecord(id);
  }
}
