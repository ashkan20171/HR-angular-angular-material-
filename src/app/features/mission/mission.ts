import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';
import { LocaleDateInput } from '../../shared/locale-date-input/locale-date-input';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { LanguageService } from '../../core/i18n/language.service';

interface MissionRecord {
  id: string; ownerId: string; start: string; end: string;
  type: string; place: string; reason: string; days: number;
  status: 'pending' | 'accepted' | 'rejected';
}

@Component({
  selector: 'app-mission', standalone: true,
  templateUrl: './mission.html', styleUrl: './mission.css',
  imports: [CommonModule, FormsModule, LocaleDateInput, LocaleDatePipe]
})
export class Mission implements OnInit {
  private records = inject(PersonalRecordsService);
  readonly language = inject(LanguageService);
  showModal = false;
  error = '';
  missionList: MissionRecord[] = [];
  form = this.emptyForm();
  get fa(): boolean { return this.language.currentLanguage === 'fa'; }
  t(fa: string, en: string): string { return this.fa ? fa : en; }
  private emptyForm() { return { start: '', end: '', type: 'local', place: '', reason: '' }; }
  ngOnInit(): void { this.reload(); }
  private reload(): void {
    const owner = this.records.ownerId;
    this.missionList = owner ? this.records.read<MissionRecord>('missions')
      .filter(x => x && x.ownerId === owner && typeof x.start === 'string' && typeof x.end === 'string') : [];
  }
  get totalDays(): number { return this.missionList.reduce((sum, m) => sum + m.days, 0); }
  get pendingCount(): number { return this.missionList.filter(x => x.status === 'pending').length; }
  openNew(): void { this.error = ''; this.form = this.emptyForm(); this.showModal = true; }
  closeModal(): void { this.showModal = false; }
  getDays(start: string, end: string): number {
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(start) || !pattern.test(end)) return 0;
    const a = new Date(start + 'T12:00:00Z'), b = new Date(end + 'T12:00:00Z');
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) ||
        a.toISOString().slice(0,10) !== start || b.toISOString().slice(0,10) !== end) return 0;
    const days = Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
    return days >= 1 && days <= 366 ? days : 0;
  }
  submit(): void {
    const ownerId = this.records.ownerId;
    const days = this.getDays(this.form.start, this.form.end);
    if (!ownerId || !days || !this.form.place.trim()) {
      this.error = this.t('مقصد و بازه زمانی معتبر را وارد کنید.', 'Enter a destination and valid date range.');
      return;
    }
    const item: MissionRecord = {
      id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      ownerId, start: this.form.start, end: this.form.end,
      type: this.form.type, place: this.form.place.trim(),
      reason: this.form.reason.trim(), days, status: 'pending'
    };
    if (!this.records.write('missions', [item, ...this.missionList])) {
      this.error = this.t('ذخیره درخواست ناموفق بود.', 'Could not save request.');
      return;
    }
    this.reload();
    this.closeModal();
  }
}
