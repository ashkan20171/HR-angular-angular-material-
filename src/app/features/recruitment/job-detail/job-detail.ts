import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecruitmentService } from '../recruitment.service';
import { Applicant } from '../applicant.model';
import { Job } from '../job.model';
import { ToastService } from '../../../shared/ui/toast.service';
import { ModalService } from '../../../shared/ui/modal.service';

type Col = { key: Applicant['status']; title: string; hint: string };

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.css',
})
export class JobDetail {
  job?: Job;
  applicants: Applicant[] = [];
  q = '';

  // add applicant form
  aName = '';
  aEmail = '';
  aPhone = '';
  aExp = '';
  aSkills = '';
  aResume = '';

  columns: Col[] = [
    { key: 'new', title: 'جدید', hint: 'ورود اولیه' },
    { key: 'review', title: 'بررسی', hint: 'رزومه و筛选' },
    { key: 'interview', title: 'مصاحبه', hint: 'هماهنگی و جلسه' },
    { key: 'accepted', title: 'پذیرفته', hint: 'همکاری' },
    { key: 'rejected', title: 'رد شده', hint: 'بایگانی' },
  ];

  draggingId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: RecruitmentService,
    private toast: ToastService,
    private modal: ModalService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.job = this.service.getJob(id);
    if (!this.job) {
      this.toast.error('این موقعیت پیدا نشد.');
      this.router.navigate(['/app/recruitment']);
      return;
    }
    this.reload();
  }

  reload() {
    if (!this.job) return;
    this.applicants = this.service.getApplicantsForJob(this.job.id);
  }

  back() { this.router.navigate(['/app/recruitment']); }

  get filteredApplicants(): Applicant[] {
    const q = this.q.trim().toLowerCase();
    if (!q) return this.applicants;
    return this.applicants.filter(a =>
      (a.name + ' ' + a.email + ' ' + (a.skills||[]).join(' ')).toLowerCase().includes(q)
    );
  }

  listFor(status: Applicant['status']) {
    return this.filteredApplicants.filter(a => a.status === status);
  }

  onDragStart(ev: DragEvent, id: number) {
    this.draggingId = id;
    ev.dataTransfer?.setData('text/plain', String(id));
    ev.dataTransfer?.setDragImage(new Image(), 0, 0);
  }

  allowDrop(ev: DragEvent) {
    ev.preventDefault();
  }

  onDrop(ev: DragEvent, status: Applicant['status']) {
    ev.preventDefault();
    const id = Number(ev.dataTransfer?.getData('text/plain') || this.draggingId);
    if (!id || !this.job) return;
    this.service.moveApplicant(id, status);
    this.toast.success('وضعیت کاندید آپدیت شد.');
    this.draggingId = null;
    this.reload();
  }

  openApplicant(a: Applicant) {
    this.router.navigate(['/app/recruitment/applicant', a.id]);
  }

  async removeApplicant(a: Applicant, ev?: Event) {
    ev?.stopPropagation();
    const ok = await this.modal.confirm({
      title: 'حذف کاندید',
      body: `کاندید "${a.name}" حذف شود؟`,
      confirmText: 'حذف',
      cancelText: 'انصراف',
      danger: true
    });
    if (!ok) return;

    this.service.deleteApplicant(a.id);
    this.toast.success('کاندید حذف شد.');
    this.reload();
  }

  addApplicant() {
    if (!this.job) return;
    if (!this.aName.trim() || !this.aEmail.trim()) {
      this.toast.warning('نام و ایمیل الزامی است.');
      return;
    }
    const a: Applicant = {
      id: Date.now(),
      jobId: this.job.id,
      name: this.aName.trim(),
      email: this.aEmail.trim(),
      phone: this.aPhone.trim(),
      experience: this.aExp.trim() || '—',
      skills: this.aSkills.split(',').map(s => s.trim()).filter(Boolean),
      resumeUrl: this.aResume.trim() || undefined,
      status: 'new'
    };
    this.service.addApplicant(a);
    this.toast.success('کاندید اضافه شد.');
    this.aName = this.aEmail = this.aPhone = this.aExp = this.aSkills = this.aResume = '';
    this.reload();
  }
}
