import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../core/i18n/language.service';
import { LocaleDatePipe } from './locale-date.pipe';

/** Backwards-compatible alias; follows the active language rather than forcing Jalali. */
@Pipe({ name: 'persianDate', standalone: true, pure: false })
export class PersianDatePipe implements PipeTransform {
  private readonly formatter: LocaleDatePipe;
  constructor(language: LanguageService) { this.formatter = new LocaleDatePipe(language); }
  transform(value: string | number | Date | null | undefined,
    opts?: { dateStyle?: 'short'|'medium'|'long'; timeStyle?: 'short'|'medium' }): string {
    return this.formatter.transform(value, opts);
  }
}
