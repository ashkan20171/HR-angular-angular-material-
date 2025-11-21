import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecruitmentService } from './recruitment.service';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  templateUrl: './recruitment.html',
  styleUrl: './recruitment.css',
  imports: [CommonModule]
})
export class Recruitment {

  jobs = this.service.getJobs();

  constructor(private service: RecruitmentService, private router: Router) {}

  openJob(id: number) {
    this.router.navigate(['/recruitment/job', id]);
  }

  newJob() {
    this.router.navigate(['/recruitment/new']);
  }
}
