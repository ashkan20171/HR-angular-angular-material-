import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecruitmentService } from './recruitment.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-recruitment-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recruitment-new.html',
  styleUrl: './recruitment-new.css'
})
export class RecruitmentNew {
  model = {
    title: '',
    department: '',
    level: 'Mid',
    salary: '',
    description: '',
    status: 'open' as const,
  };

  constructor(
    private service: RecruitmentService,
    private router: Router,
    private toast: ToastService,
  ) {}

  back() {
    this.router.navigate(['/app/recruitment']);
  }

  save() {
    if (!this.model.title.trim() || !this.model.department.trim()) {
      this.toast.error('عنوان و واحد سازمانی الزامی است');
      return;
    }

    const job = {
      id: Date.now(),
      ...this.model,
      description: this.model.description?.trim() ?? ''
    };

    this.service.addJob(job as any);
    this.toast.success('موقعیت شغلی ایجاد شد', 'Recruitment');
    this.router.navigate(['/app/recruitment', job.id]);
  }
}
