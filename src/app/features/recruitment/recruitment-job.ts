import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { RecruitmentService } from './recruitment.service';
import { Applicant } from './applicant.model';
import { ToastService } from '../../shared/toast/toast.service';
import { EmptyState } from '../../shared/ui/empty-state';

type Stage = Applicant['status'];

@Component({
  selector: 'app-recruitment-job',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, EmptyState],
  templateUrl: './recruitment-job.html',
  styleUrl: './recruitment-job.css',
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ transform: 'translateY(10px)', opacity: 0 }),
        animate('220ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class RecruitmentJob {
  jobId = signal<number>(0);

  job = computed(() => this.service.getJobs().find(j => j.id === this.jobId()));
  applicants = signal<Applicant[]>([]);
  searchTerm = signal<string>('');

  columns = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    const list = this.applicants().filter(a => {
      if (!q) return true;
      const blob = `${a.name} ${a.email} ${a.phone} ${(a.skills ?? []).join(' ')}`.toLowerCase();
      return blob.includes(q);
    });
    return {
      new: list.filter(a => a.status === 'new'),
      review: list.filter(a => a.status === 'review'),
      interview: list.filter(a => a.status === 'interview'),
      accepted: list.filter(a => a.status === 'accepted'),
      rejected: list.filter(a => a.status === 'rejected'),
    } as Record<Stage, Applicant[]>;
  });

  stageMeta: { key: Stage; label: string; hint: string }[] = [
    { key: 'new', label: 'جدید', hint: 'رزومه‌های تازه' },
    { key: 'review', label: 'بررسی', hint: 'در حال بررسی' },
    { key: 'interview', label: 'مصاحبه', hint: 'زمان‌بندی مصاحبه' },
    { key: 'accepted', label: 'پذیرفته', hint: 'آفر/پذیرش' },
    { key: 'rejected', label: 'رد شده', hint: 'عدم تطابق' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: RecruitmentService,
    private toast: ToastService,
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.jobId.set(id);
    this.refresh();
  }

  refresh() {
    const list = this.service.getApplicantsForJob(this.jobId());
    this.applicants.set(list);
  }

  back() {
    this.router.navigate(['/app/recruitment']);
  }

  drop(ev: CdkDragDrop<Applicant[]>, stage: Stage) {
    if (ev.previousContainer === ev.container) return;

    const item = ev.previousContainer.data[ev.previousIndex];
    const updated: Applicant = { ...item, status: stage };
    this.service.updateApplicant(updated);

    // Update local signals for immediate UI
    const list = this.applicants().map(a => a.id === updated.id ? updated : a);
    this.applicants.set(list);

    this.toast.success(`وضعیت «${updated.name}» به «${this.stageLabel(stage)}» تغییر کرد`, 'Pipeline');

    // keep CDK arrays in sync visually
    transferArrayItem(
      ev.previousContainer.data,
      ev.container.data,
      ev.previousIndex,
      ev.currentIndex
    );
  }

  stageLabel(s: Stage) {
    return this.stageMeta.find(x => x.key === s)?.label ?? s;
  }
}
