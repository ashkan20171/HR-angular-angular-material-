import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import moment from 'moment-jalaali';
import { LanguageService } from '../i18n/language.service';

moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false });

/** A language-aware Material adapter.
 * Persian UI exposes Jalali calendar components while English exposes Gregorian ones.
 * The underlying value remains a native Date so APIs can continue using ISO/Gregorian dates.
 */
@Injectable()
export class JalaliDateAdapter extends NativeDateAdapter {
  constructor(private language: LanguageService) { super('fa-IR'); }
  private get fa(): boolean { return this.language.currentLanguage === 'fa'; }

  override getYear(date: Date): number { return this.fa ? moment(date).jYear() : date.getFullYear(); }
  override getMonth(date: Date): number { return this.fa ? moment(date).jMonth() : date.getMonth(); }
  override getDate(date: Date): number { return this.fa ? moment(date).jDate() : date.getDate(); }
  override getDayOfWeek(date: Date): number { return date.getDay(); }

  override getMonthNames(style: 'long'|'short'|'narrow'): string[] {
    if (!this.fa) return super.getMonthNames(style);
    const long=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    return style === 'narrow' ? long.map(x => x[0]) : long;
  }
  override getDateNames(): string[] { return Array.from({length:31},(_,i)=>String(i+1)); }
  override getDayOfWeekNames(style: 'long'|'short'|'narrow'): string[] {
    if (!this.fa) return super.getDayOfWeekNames(style);
    const long=['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
    const short=['ی','د','س','چ','پ','ج','ش'];
    return style === 'long' ? long : short;
  }
  override getYearName(date: Date): string { return String(this.getYear(date)); }
  override getFirstDayOfWeek(): number { return this.fa ? 6 : 0; }
  override getNumDaysInMonth(date: Date): number {
    if (!this.fa) return super.getNumDaysInMonth(date);
    const y=moment(date).jYear(), m=moment(date).jMonth();
    return m<6 ? 31 : m<11 ? 30 : (moment.jIsLeapYear(y) ? 30 : 29);
  }
  override clone(date: Date): Date { return new Date(date.getTime()); }
  override createDate(year: number, month: number, date: number): Date {
    if (!this.fa) return super.createDate(year,month,date);
    if (month<0 || month>11) throw Error(`Invalid Jalali month index ${month}`);
    const result=moment(`${year}/${month+1}/${date}`,'jYYYY/jM/jD',true);
    if (!result.isValid()) throw Error(`Invalid Jalali date ${year}/${month+1}/${date}`);
    return result.toDate();
  }
  override today(): Date { return new Date(); }
  override addCalendarYears(date: Date, years: number): Date { if(!this.fa) return super.addCalendarYears(date,years); const m=moment(date); m.jYear(m.jYear()+years); return m.toDate(); }
  override addCalendarMonths(date: Date, months: number): Date { if(!this.fa) return super.addCalendarMonths(date,months); const m=moment(date); m.jMonth(m.jMonth()+months); return m.toDate(); }
  override addCalendarDays(date: Date, days: number): Date { return moment(date).add(days,'day').toDate(); }
  override toIso8601(date: Date): string { const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0'); return `${y}-${m}-${d}`; }
  override isDateInstance(obj: any): boolean { return obj instanceof Date; }
  override isValid(date: Date): boolean { return date instanceof Date && !Number.isNaN(date.getTime()); }
  override invalid(): Date { return new Date(NaN); }
  override format(date: Date, _displayFormat: Object): string { return this.fa ? moment(date).format('jYYYY/jMM/jDD') : moment(date).format('YYYY/MM/DD'); }
  override parse(value: any): Date|null {
    if (!value) return null; if (value instanceof Date) return value;
    const input=String(value).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632));
    const p=this.fa ? moment(input,['jYYYY/jMM/jDD','jYYYY-jMM-jDD'],true) : moment(input,['YYYY/MM/DD','YYYY-MM-DD','MM/DD/YYYY'],true);
    return p.isValid()?p.toDate():null;
  }
}
