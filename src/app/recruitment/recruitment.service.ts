import { Injectable, signal } from '@angular/core';
import { Job } from './job.model';
import { Applicant } from './applicant.model';

@Injectable({
  providedIn: 'root'
})
export class RecruitmentService {

  private jobs = signal<Job[]>([]);
  private applicants = signal<Applicant[]>([]);

  constructor() {
    const j = localStorage.getItem('jobs');
    const a = localStorage.getItem('applicants');

    if (j) this.jobs.set(JSON.parse(j));
    if (a) this.applicants.set(JSON.parse(a));
  }

  saveJobs() {
    localStorage.setItem('jobs', JSON.stringify(this.jobs()));
  }

  saveApplicants() {
    localStorage.setItem('applicants', JSON.stringify(this.applicants()));
  }

  getJobs() {
    return this.jobs();
  }

  addJob(job: Job) {
    this.jobs().unshift(job);
    this.saveJobs();
  }

  updateJob(job: Job) {
    const list = this.jobs();
    const i = list.findIndex(x => x.id === job.id);
    if (i >= 0) {
      list[i] = job;
      this.saveJobs();
    }
  }

  getApplicantsForJob(jobId: number) {
    return this.applicants().filter(a => a.jobId === jobId);
  }

  addApplicant(a: Applicant) {
    this.applicants().unshift(a);
    this.saveApplicants();
  }

  updateApplicant(a: Applicant) {
    const list = this.applicants();
    const i = list.findIndex(x => x.id === a.id);
    if (i >= 0) {
      list[i] = a;
      this.saveApplicants();
    }
  }
}
