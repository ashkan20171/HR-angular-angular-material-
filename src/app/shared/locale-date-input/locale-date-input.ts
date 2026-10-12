import { Component, forwardRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { LanguageService } from '../../core/i18n/language.service';

/** Calendar-aware date input. External model is always YYYY-MM-DD (Gregorian). */
@Component({
  selector: 'app-locale-date-input', standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatInputModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LocaleDateInput), multi: true }],
  template: `<div class="locale-date-field" [attr.dir]="language.currentDirection">
    <input matInput [matDatepicker]="picker" [ngModel]="date" (ngModelChange)="update($event)"
      (blur)="onTouched()" [disabled]="disabled" [placeholder]="language.currentLanguage === 'fa' ? 'روز / ماه / سال' : 'YYYY/MM/DD'" [attr.aria-label]="label || (language.currentLanguage === 'fa' ? 'انتخاب تاریخ' : 'Select date')" />
    <mat-datepicker-toggle [for]="picker" [disabled]="disabled"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </div>`,
  styles: [`:host{display:inline-block;min-width:165px;max-width:100%}.locale-date-field{display:flex;align-items:center;gap:4px;background:var(--surface,#fff);border:1px solid var(--border,#cbd5e1);border-radius:12px;padding:0 8px;min-height:42px}.locale-date-field:focus-within{outline:2px solid #2563eb;outline-offset:1px}.locale-date-field input{min-width:0;width:100%;border:0!important;background:transparent!important;outline:0!important;padding:8px 4px!important;color:inherit!important}.locale-date-field mat-datepicker-toggle{flex:none}`]
})
export class LocaleDateInput implements ControlValueAccessor {
  readonly language = inject(LanguageService);
  @Input() label = '';
  date: Date | null = null;
  disabled = false;
  private change: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  writeValue(value: string | Date | null): void {
    if (!value) { this.date = null; return; }
    if (value instanceof Date) { this.date = Number.isNaN(value.getTime()) ? null : value; return; }
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) { this.date = null; return; }
    const date = new Date(+match[1], +match[2] - 1, +match[3]);
    this.date = date.getFullYear() === +match[1] && date.getMonth() === +match[2] - 1 && date.getDate() === +match[3] ? date : null;
  }
  registerOnChange(fn: (value: string) => void): void { this.change = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(value: boolean): void { this.disabled = value; }
  update(value: Date | null): void {
    this.date = value instanceof Date && !Number.isNaN(value.getTime()) ? value : null;
    if (!this.date) { this.change(''); return; }
    const d = this.date;
    this.change(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
  }
}
