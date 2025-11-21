import { Injectable, signal } from '@angular/core';
import { PerformanceRecord } from './performance.model';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private data = signal<PerformanceRecord[]>([]);

  constructor() {
    const saved = localStorage.getItem('performance');
    if (saved) this.data.set(JSON.parse(saved));
  }

  getAll() {
    return this.data();
  }

  getById(id: number) {
    return this.data().find(p => p.id === id);
  }

  saveRecord(record: PerformanceRecord) {
    const list = this.data();
    const index = list.findIndex(r => r.id === record.id);

    if (index >= 0) list[index] = record;
    else list.unshift(record);

    this.data.set(list);
    localStorage.setItem('performance', JSON.stringify(list));
  }

  calculateFinalScore(record: PerformanceRecord) {
    let total = 0;

    record.kpis.forEach(kpi => {
      const ev = record.evaluations.find(e => e.kpiId === kpi.id);
      if (!ev || ev.managerScore === null) return;

      total += ev.managerScore * (kpi.weight / 100);
    });

    record.finalScore = Math.round(total);
    this.saveRecord(record);
  }
}
