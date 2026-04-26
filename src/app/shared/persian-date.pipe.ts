import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianDate',
  standalone: true
})
export class PersianDatePipe implements PipeTransform {
  transform(value: string | number | Date | null | undefined, opts?: { dateStyle?: 'short'|'medium'|'long'; timeStyle?: 'short'|'medium' }): string {
    if (!value) return '—';
    const d = value instanceof Date ? value : new Date(value);
    const dateStyle = opts?.dateStyle ?? 'medium';
    const timeStyle = opts?.timeStyle;

    try {
      const fmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
        dateStyle,
        ...(timeStyle ? { timeStyle } : {}),
      } as any);
      return fmt.format(d);
    } catch {
      return d.toLocaleString('fa-IR');
    }
  }
}
