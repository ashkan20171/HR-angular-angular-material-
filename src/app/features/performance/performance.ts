import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerformanceService } from './performance.service';
import { PerformanceRecord } from './performance.model';

@Component({
  selector: 'app-performance',
  standalone: true,
  templateUrl: './performance.html',
  styleUrl: './performance.css',
  imports: [CommonModule, FormsModule]
})
export class Performance {

  record!: PerformanceRecord;
  user = localStorage.getItem('userName') || 'کارمند';

  constructor(private perf: PerformanceService) {
    this.initRecord();
  }

  initRecord() {
    this.record = {
      id: Date.now(),
      user: this.user,
      period: '1403-Q4',
      kpis: [
        { id: 1, title: 'کیفیت انجام کار', weight: 40 },
        { id: 2, title: 'تعهد به زمان‌بندی', weight: 25 },
        { id: 3, title: 'روحیه همکاری تیمی', weight: 20 },
        { id: 4, title: 'نوآوری و بهبود', weight: 15 }
      ],
      evaluations: []
    };

    this.record.evaluations = this.record.kpis.map(k => ({
      kpiId: k.id,
      selfScore: null,
      managerScore: null,
      comment: ''
    }));
  }

  submitSelf() {
    alert('خودارزیابی ثبت شد');
    this.perf.saveRecord(this.record);
  }

  submitManager() {
    this.perf.calculateFinalScore(this.record);
    alert('ارزیابی مدیریتی ثبت شد');
  }
}
