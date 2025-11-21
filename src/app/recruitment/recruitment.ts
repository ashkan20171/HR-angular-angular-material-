import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruitmentService } from './recruitment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  templateUrl: './recruitment.html',
  styleUrl: './recruitment.css',
  imports: [CommonModule, FormsModule]
})
export class Recruitment {

  selectedJob: number | null = null;

  constructor(public service: RecruitmentService) {}

  selectJob(id: number) {
    this.selectedJob = id;
  }
}
