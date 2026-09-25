import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../core/i18n/language.service';

@Pipe({ name: 'localeDate', standalone: true, pure: false })
export class LocaleDatePipe implements PipeTransform {
  constructor(private language: LanguageService) {}
  transform(value: string | number | Date | null | undefined, opts?: { dateStyle?: 'short'|'medium'|'long'|'full'; timeStyle?: 'short'|'medium' }): string {
    if (value === null || value === undefined || value === '') return '—';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    const isFa = this.language.currentLanguage === 'fa';
    const locale = isFa ? 'fa-IR-u-ca-persian' : 'en-US-u-ca-gregory';
    try {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: opts?.dateStyle ?? 'medium',
        ...(opts?.timeStyle ? { timeStyle: opts.timeStyle } : {})
      }).format(date);
    } catch {
      return date.toLocaleDateString(isFa ? 'fa-IR' : 'en-US');
    }
  }
}
