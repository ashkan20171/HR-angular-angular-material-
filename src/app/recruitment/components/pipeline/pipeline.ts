import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruitmentService, Applicant } from '../../recruitment.service';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  templateUrl: './pipeline.html',
  styleUrl: './pipeline.css',
  imports: [CommonModule]
})
export class Pipeline {

  @Input() jobId!: number;
  applicants: Applicant[] = [];

  stages = [
    'بررسی اولیه',
    'مصاحبه HR',
    'مصاحبه تخصصی',
    'مصاحبه نهایی',
    'پذیرفته شده',
    'رد شده'
  ];

  constructor(public service: RecruitmentService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.applicants = this.service.getApplicantsByJob(this.jobId);
  }

  nextStage(app: Applicant) {
    if (app.stage < 4) app.stage++;
    this.service.updateApplicant(app);
    this.refresh();
  }

  previousStage(app: Applicant) {
    if (app.stage > 0 && app.stage < 4) app.stage--;
    this.service.updateApplicant(app);
    this.refresh();
  }

  markAccepted(app: Applicant) {
    app.stage = 4;
    this.service.updateApplicant(app);
    this.refresh();
  }

  markRejected(app: Applicant) {
    app.stage = 5;
    this.service.updateApplicant(app);
    this.refresh();
  }

}
