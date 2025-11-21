import { Injectable } from '@angular/core';

export interface Evaluation {
  date: string;
  communication: number;
  teamwork: number;
  creativity: number;
  accuracy: number;
  speed: number;
  responsibility: number;
  discipline: number;
  average: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  evaluations: Evaluation[] = [];

  constructor() {
    const saved = localStorage.getItem('evaluations');
    if (saved) this.evaluations = JSON.parse(saved);
  }

  addEvaluation(ev: Evaluation) {
    this.evaluations.unshift(ev);
    localStorage.setItem('evaluations', JSON.stringify(this.evaluations));
  }

  all() {
    return this.evaluations;
  }
}
