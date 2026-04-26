import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecruitmentService } from './recruitment.service';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../shared/ui/modal.service';
import { ToastService } from '../../shared/ui/toast.service';
import { Job } from './job.model';

type ViewMode = 'cards' | 'table';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recruitment.html',
  styleUrl: './recruitment.css'
})
export class Recruitment implements OnInit {

  jobs: Job[] = [];

  // UI state
  viewMode: ViewMode = (localStorage.getItem('recruit_view') as ViewMode) || 'cards';
  q = '';
  status: '' | Job['status'] = '';
  department = '';
  level = '';
  pageSize = Number(localStorage.getItem('recruit_ps') || 8);
  page = 1;

  constructor(
    private service: RecruitmentService,
    private router: Router,
    private modal: ModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.jobs = this.service.getJobs();
    if (this.page > this.totalPages) this.page = Math.max(1, this.totalPages);
  }

  get departments(): string[] {
    return Array.from(new Set(this.jobs.map(j => j.department))).sort();
  }

  get levels(): string[] {
    return Array.from(new Set(this.jobs.map(j => j.level))).sort();
  }

  setView(mode: ViewMode) {
    this.viewMode = mode;
    localStorage.setItem('recruit_view', mode);
  }

  onPageSizeChange() {
    localStorage.setItem('recruit_ps', String(this.pageSize));
    this.page = 1;
  }

  get filtered(): Job[] {
    const q = this.q.trim().toLowerCase();
    return this.jobs.filter(j => {
      const okQ = !q || (j.title + ' ' + j.department + ' ' + j.level).toLowerCase().includes(q);
      const okS = !this.status || j.status === this.status;
      const okD = !this.department || j.department === this.department;
      const okL = !this.level || j.level === this.level;
      return okQ && okS && okD && okL;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get paged(): Job[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  nextPage() { this.page = Math.min(this.totalPages, this.page + 1); }
  prevPage() { this.page = Math.max(1, this.page - 1); }

  newJob() {
    this.router.navigate(['/app/recruitment/new']);
  }

  openJob(id: number) {
    this.router.navigate(['/app/recruitment', id]);
  }

  async deleteJob(job: Job, ev?: Event) {
    ev?.stopPropagation();
    const ok = await this.modal.confirm({
      title: 'حذف موقعیت شغلی',
      body: `این کار برگشت‌پذیر نیست.\n\n"${job.title}" حذف شود؟`,
      confirmText: 'حذف',
      cancelText: 'انصراف',
      danger: true
    });
    if (!ok) return;
    this.service.deleteJob(job.id);
    this.toast.success('موقعیت با موفقیت حذف شد.');
    this.reload();
  }

  seedDemo() {
    this.service.seedDemo();
    this.toast.info('داده‌های دمو اضافه شد.', 'Demo');
    this.reload();
  }

  exportCsv() {
    const rows = this.filtered.map(j => ({
      id: j.id,
      title: j.title,
      department: j.department,
      level: j.level,
      salary: j.salary,
      status: j.status
    }));

    const header = Object.keys(rows[0] || { id: '', title: '', department: '', level: '', salary: '', status: '' }).join(',');
    const csv = [header, ...rows.map(r =>
      Object.values(r).map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(',')
    )].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recruitment_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    this.toast.success('خروجی CSV آماده شد.');
  }

  clearFilters() {
    this.q = '';
    this.status = '';
    this.department = '';
    this.level = '';
    this.page = 1;
  }
}
