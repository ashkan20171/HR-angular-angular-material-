import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelfReview } from './components/self-review/self-review';
import { ManagerReview } from './components/manager-review/manager-review';
import { KpiChart } from './components/kpi-chart/kpi-chart';
import { RadarSkills } from './components/radar-skills/radar-skills';
import { Summary } from './components/summary/summary';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [
    CommonModule,
    SelfReview,
    ManagerReview,
    KpiChart,
    RadarSkills,
    Summary
  ],
  templateUrl: './performance.html',
  styleUrl: './performance.css'
})
export class Performance {

  tab = 'self';

  setTab(t: string) {
    this.tab = t;
  }
}
