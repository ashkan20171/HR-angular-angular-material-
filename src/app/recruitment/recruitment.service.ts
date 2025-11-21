import { Injectable } from '@angular/core';

export interface Job {
  id: number;
  title: string;
  department: string;
  need: number;
  deadline: string;
  status: 'open' | 'closed';
}

export interface Applicant {
  id: number;
  jobId: number;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  resume: string; 
  stage: number; 
  comment: string;
}

@Injectable({ providedIn: 'root' })
export class RecruitmentService {

  jobs: Job[] = [];
  applicants: Applicant[] = [];

  constructor() {
    const j = localStorage.getItem('jobs');
    const a = localStorage.getItem('applicants');

    if (j) this.jobs = JSON.parse(j);
    if (a) this.applicants = JSON.parse(a);
  }

  save() {
    localStorage.setItem('jobs', JSON.stringify(this.jobs));
    localStorage.setItem('applicants', JSON.stringify(this.applicants));
  }

  addJob(job: Job) {
    job.id = Date.now();
    this.jobs.push(job);
    this.save();
  }

  addApplicant(app: Applicant) {
    app.id = Date.now();
    this.applicants.push(app);
    this.save();
  }

  updateApplicant(app: Applicant) {
    const index = this.applicants.findIndex(a => a.id === app.id);
    if (index !== -1) {
      this.applicants[index] = app;
      this.save();
    }
  }

  getApplicantsByJob(jobId: number) {
    return this.applicants.filter(a => a.jobId === jobId);
  }
}
