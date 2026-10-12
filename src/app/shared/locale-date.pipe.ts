import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../core/i18n/language.service';

/** Render dates using the calendar selected by the UI language. Storage remains ISO/Gregorian. */
@Pipe({ name: 'localeDate', standalone: true, pure: false })
export class LocaleDatePipe implements PipeTransform {
  constructor(private readonly language: LanguageService) {}

  transform(value: string | number | Date | null | undefined,
            opts?: { dateStyle?: 'short'|'medium'|'long'|'full'; timeStyle?: 'short'|'medium' }): string {
    if (value === null || value === undefined || value === '') return '—';
    let date: Date;
    if (value instanceof Date) date = value;
    else if (typeof value === 'number') date = new Date(value);
    else {
      // Parse ISO dates as local calendar days, avoiding UTC midnight timezone shifts.
      const iso = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(value);
      date = iso && value.length === 10
        ? new Date(+iso[1], +iso[2] - 1, +iso[3])
        : new Date(value);
    }
    if (Number.isNaN(date.getTime())) return String(value);
    const fa = this.language.currentLanguage === 'fa';
    try {
      return new Intl.DateTimeFormat(fa ? 'fa-IR-u-ca-persian' : 'en-US-u-ca-gregory', {
        dateStyle: opts?.dateStyle ?? 'medium',
        ...(opts?.timeStyle ? { timeStyle: opts.timeStyle } : {})
      }).format(date);
    } catch { return String(value); }
  }
}
