import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { AuthService } from '../../core/auth/auth.service';
import { LanguageService } from '../../core/i18n/language.service';

type RequestStatus = 'pending' | 'approved' | 'rejected';
interface PersonalRequest {
  id: string; kind: string; date: string; status: RequestStatus;
}
/**
 * Frontend-only self-service request overview.
 * No cross-account reads: manager approval requires an authenticated API and verified org chart.
 */
@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule, LocaleDatePipe],
  templateUrl: './approvals.html',
  styleUrl: './approvals.css'
})
export class Approvals {
  private records = inject(PersonalRecordsService);
  private auth = inject(AuthService);
  private language = inject(LanguageService);
  query = '';
  get fa(): boolean { return this.language.currentLanguage === 'fa'; }
  t(fa: string, en: string): string { return this.fa ? fa : en; }
  get canApprove(): boolean { return this.auth.hasPermission('approvals.manage') || this.auth.hasPermission('requests.approve'); }
  private status(value: unknown): RequestStatus {
    return value === 'accepted' || value === 'approved' ? 'approved'
      : value === 'rejected' ? 'rejected' : 'pending';
  }
  get items(): PersonalRequest[] {
    const owner = this.records.ownerId;
    if (!owner) return [];
    const kinds = [
      { key: 'overtime', fa: 'اضافه‌کاری', en: 'Overtime' },
      { key: 'missions', fa: 'مأموریت', en: 'Mission' },
      { key: 'leaves', fa: 'مرخصی', en: 'Leave' }
    ];
    const items: PersonalRequest[] = [];
    for (const kind of kinds) {
      for (const record of this.records.read<Record<string, unknown>>(kind.key).slice(0, 1000)) {
        if (!record || String(record['ownerId'] ?? '') !== owner) continue;
        const date = String(record['date'] ?? record['start'] ?? '');
        items.push({
          id: String(record['id'] ?? ''),
          kind: this.t(kind.fa, kind.en),
          date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '—',
          status: this.status(record['status'])
        });
      }
    }
    return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 500);
  }
  get rows(): PersonalRequest[] {
    const query = this.query.trim().toLocaleLowerCase();
    return query ? this.items.filter(x => `${x.kind} ${x.date}`.toLocaleLowerCase().includes(query)) : this.items;
  }
  get pending(): number { return this.items.filter(x => x.status === 'pending').length; }
  get approved(): number { return this.items.filter(x => x.status === 'approved').length; }
  statusText(status: RequestStatus): string {
    return status === 'approved' ? this.t('تأیید شده', 'Approved')
      : status === 'rejected' ? this.t('رد شده', 'Rejected') : this.t('در انتظار', 'Pending');
  }
}
