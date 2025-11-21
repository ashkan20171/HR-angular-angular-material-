import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecruitmentService } from './recruitment.service';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruitment.html',
  styleUrl: './recruitment.css'
})
export class Recruitment implements OnInit {

  jobs: any[] = [];

  constructor(
    private service: RecruitmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.jobs = this.service.getJobs();
  }

  newJob() {
    this.router.navigate(['/recruitment/new']);
  }

  openJob(id: number) {
    this.router.navigate(['/recruitment', id]);
  }

}
