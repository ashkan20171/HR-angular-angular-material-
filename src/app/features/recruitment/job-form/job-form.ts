import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecruitmentService } from '../recruitment.service';
import { ToastService } from '../../../shared/ui/toast.service';
import { Job } from '../job.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm {
  job: Job = {
    id: Date.now(),
    title: '',
    department: '',
    level: 'Junior',
    salary: '',
    description: '',
    status: 'open'
  };

  saving = false;

  constructor(
    private service: RecruitmentService,
    private router: Router,
    private toast: ToastService
  ) {}

  save() {
    if (!this.job.title.trim() || !this.job.department.trim()) {
      this.toast.warning('عنوان و دپارتمان الزامی است.');
      return;
    }
    this.saving = true;

    // normalize
    this.job = { ...this.job, title: this.job.title.trim(), department: this.job.department.trim() };

    this.service.addJob(this.job);
    this.toast.success('موقعیت شغلی ایجاد شد.');
    this.router.navigate(['/app/recruitment']);
  }

  cancel() {
    this.router.navigate(['/app/recruitment']);
  }
}
