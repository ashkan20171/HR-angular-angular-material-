import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruitmentService } from '../recruitment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Applicant } from '../applicant.model';
import { ToastService } from '../../../shared/ui/toast.service';
import { ModalService } from '../../../shared/ui/modal.service';
import { PersianDatePipe } from '../../../shared/persian-date.pipe';

@Component({
  selector: 'app-applicant-profile',
  standalone: true,
  templateUrl: './applicant-profile.html',
  styleUrl: './applicant-profile.css',
  imports: [CommonModule, FormsModule, PersianDatePipe]
})
export class ApplicantProfile {

  applicant?: Applicant;
  noteText = '';
  notes: { text: string, date: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: RecruitmentService,
    private toast: ToastService,
    private modal: ModalService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.applicant = this.service.getApplicant(id);

    if (!this.applicant) {
      this.toast.error('کاندید پیدا نشد.');
      this.router.navigate(['/app/recruitment']);
      return;
    }

    this.notes = this.loadNotes();
  }

  back() {
    this.router.navigate(['/app/recruitment', this.applicant?.jobId]);
  }

  // ذخیره یادداشت‌ها
  private saveNotes() {
    if (!this.applicant) return;
    localStorage.setItem(`notes_${this.applicant.id}`, JSON.stringify(this.notes));
  }

  // بارگذاری
  private loadNotes(): { text: string, date: number }[] {
    if (!this.applicant) return [];
    const saved = localStorage.getItem(`notes_${this.applicant.id}`);
    return saved ? JSON.parse(saved) : [];
  }

  addNote() {
    if (!this.applicant) return;
    if (!this.noteText.trim()) return;

    this.notes.unshift({
      text: this.noteText.trim(),
      date: Date.now()
    });

    this.noteText = '';
    this.saveNotes();
    this.toast.success('یادداشت ثبت شد.');
  }

  async deleteNote(i: number) {
    const ok = await this.modal.confirm({
      title: 'حذف یادداشت',
      body: 'این یادداشت حذف شود؟',
      confirmText: 'حذف',
      cancelText: 'انصراف',
      danger: true
    });
    if (!ok) return;

    this.notes.splice(i, 1);
    this.saveNotes();
    this.toast.success('یادداشت حذف شد.');
  }
}
