import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerformanceService } from './performance.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './performance.html',
  styleUrl: './performance.css'
})
export class Performance {

  evaluation = {
    communication: 3,
    teamwork: 3,
    creativity: 3,
    accuracy: 3,
    speed: 3,
    responsibility: 3,
    discipline: 3,
    comment: ''
  };

  evaluations = this.service.all();

  constructor(private service: PerformanceService) {}

  get average() {
    const v = this.evaluation;
    return Math.round(
      (v.communication +
        v.teamwork +
        v.creativity +
        v.accuracy +
        v.speed +
        v.responsibility +
        v.discipline) / 7
    );
  }

  save() {
    this.service.addEvaluation({
      ...this.evaluation,
      average: this.average,
      date: new Date().toLocaleDateString('fa-IR')
    });

    this.evaluation.comment = '';
  }
}
