import { Injectable, signal } from '@angular/core';
import { Job } from './job.model';
import { Applicant } from './applicant.model';

@Injectable({ providedIn: 'root' })
export class RecruitmentService {
  private jobs = signal<Job[]>([]);
  private applicants = signal<Applicant[]>([]);

  constructor() {
    const j = localStorage.getItem('jobs');
    const a = localStorage.getItem('applicants');

    if (j) this.jobs.set(JSON.parse(j));
    if (a) this.applicants.set(JSON.parse(a));
  }

  private saveJobs() {
    localStorage.setItem('jobs', JSON.stringify(this.jobs()));
  }

  private saveApplicants() {
    localStorage.setItem('applicants', JSON.stringify(this.applicants()));
  }

  // Jobs
  getJobs(): Job[] {
    return this.jobs();
  }

  getJob(id: number): Job | undefined {
    return this.jobs().find(j => j.id === id);
  }

  addJob(job: Job) {
    this.jobs.update(list => [job, ...list]);
    this.saveJobs();
  }

  updateJob(job: Job) {
    this.jobs.update(list => list.map(x => x.id === job.id ? job : x));
    this.saveJobs();
  }

  deleteJob(id: number) {
    this.jobs.update(list => list.filter(j => j.id !== id));
    this.applicants.update(list => list.filter(a => a.jobId !== id));
    this.saveJobs();
    this.saveApplicants();
  }

  // Applicants
  getApplicantsForJob(jobId: number): Applicant[] {
    return this.applicants().filter(a => a.jobId === jobId);
  }

  getApplicant(id: number): Applicant | undefined {
    return this.applicants().find(a => a.id === id);
  }

  addApplicant(a: Applicant) {
    this.applicants.update(list => [a, ...list]);
    this.saveApplicants();
  }

  updateApplicant(a: Applicant) {
    this.applicants.update(list => list.map(x => x.id === a.id ? a : x));
    this.saveApplicants();
  }

  deleteApplicant(id: number) {
    this.applicants.update(list => list.filter(a => a.id !== id));
    this.saveApplicants();
  }

  moveApplicant(id: number, status: Applicant['status']) {
    const a = this.getApplicant(id);
    if (!a) return;
    this.updateApplicant({ ...a, status });
  }

  seedDemo() {
    if (this.jobs().length > 0) return;

    const demoJobs: Job[] = [
      { id: 1001, title: 'Frontend Developer (Angular)', department: 'Engineering', level: 'Mid', salary: '€55k-€70k', description: 'ساخت UI مدرن و بهینه با Angular.', status: 'open' },
      { id: 1002, title: 'HR Specialist', department: 'HR', level: 'Junior', salary: '€35k-€45k', description: 'پشتیبانی فرآیند جذب و ارتباط با کاندیدها.', status: 'open' },
      { id: 1003, title: 'Accountant', department: 'Finance', level: 'Senior', salary: '€60k-€80k', description: 'گزارش‌های مالی و کنترل هزینه.', status: 'paused' },
    ];

    const demoApplicants: Applicant[] = [
      { id: 2001, jobId: 1001, name: 'Sara N.', email: 'sara@example.com', phone: '+49 151 0000', experience: '3 سال', skills: ['Angular','TypeScript','UI'], status: 'new', resumeUrl: 'https://example.com' },
      { id: 2002, jobId: 1001, name: 'Mehdi K.', email: 'mehdi@example.com', phone: '+49 151 1111', experience: '5 سال', skills: ['Angular','RxJS','Testing'], status: 'review' },
      { id: 2003, jobId: 1001, name: 'Amir S.', email: 'amir@example.com', phone: '+49 151 2222', experience: '2 سال', skills: ['HTML','CSS','TS'], status: 'interview' },
      { id: 2004, jobId: 1002, name: 'Nika A.', email: 'nika@example.com', phone: '+49 151 3333', experience: '1 سال', skills: ['Recruiting','Communication'], status: 'new' },
      { id: 2005, jobId: 1003, name: 'Farid R.', email: 'farid@example.com', phone: '+49 151 4444', experience: '8 سال', skills: ['IFRS','Excel','Reporting'], status: 'accepted' },
    ];

    this.jobs.set(demoJobs);
    this.applicants.set(demoApplicants);
    this.saveJobs();
    this.saveApplicants();
  }
}
