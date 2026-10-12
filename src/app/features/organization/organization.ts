import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocaleDateInput } from '../../shared/locale-date-input/locale-date-input';
import { LanguageService } from '../../core/i18n/language.service';
import { EmploymentProfileService, EmploymentProfile } from '../../core/auth/employment-profile.service';
/** Private employment draft: never treated as verified organization membership. */
@Component({
 selector:'app-organization', standalone:true, imports:[CommonModule,FormsModule,LocaleDateInput],
 template:`<section class="hr-page" [attr.dir]="fa?'rtl':'ltr'">
 <header class="hr-page__hero"><div><span class="hr-eyebrow">AshkanHR · Organization</span><h1>{{t('اطلاعات استخدامی من','My employment profile')}}</h1><p>{{t('پیش‌نویس شخصی؛ این اطلاعات هنوز توسط سازمان تأیید نشده‌اند.','Private draft — not verified by your organization.')}}</p></div></header>
 <article class="hr-panel"><div class="hr-panel__head"><h2>{{t('مشخصات شغلی','Employment details')}}</h2><span class="hr-badge">{{t('تأییدنشده','Unverified')}}</span></div>
 <div class="hr-panel__body"><div class="hr-form-grid">
 <label>{{t('کد پرسنلی','Employee code')}}<input class="hr-search" maxlength="120" [(ngModel)]="form.employeeCode"></label>
 <label>{{t('سمت','Job title')}}<input class="hr-search" maxlength="120" [(ngModel)]="form.jobTitle"></label>
 <label>{{t('واحد سازمانی','Department')}}<input class="hr-search" maxlength="120" [(ngModel)]="form.department"></label>
 <label>{{t('تیم','Team')}}<input class="hr-search" maxlength="120" [(ngModel)]="form.team"></label>
 <label>{{t('نام مدیر مستقیم','Direct manager name')}}<input class="hr-search" maxlength="120" [(ngModel)]="form.managerName"></label>
 <label>{{t('تاریخ شروع همکاری','Employment start date')}}<app-locale-date-input [(ngModel)]="form.startDate"></app-locale-date-input></label>
 <label>{{t('نوع همکاری','Employment type')}}<select class="hr-search" [(ngModel)]="form.employmentType"><option value="full-time">{{t('تمام‌وقت','Full-time')}}</option><option value="part-time">{{t('پاره‌وقت','Part-time')}}</option><option value="contract">{{t('قراردادی','Contract')}}</option><option value="intern">{{t('کارآموز','Intern')}}</option></select></label>
 </div><p *ngIf="error" role="alert" class="hr-form-error">{{error}}</p><button class="hr-btn" type="button" (click)="save()">{{t('ذخیره پیش‌نویس','Save draft')}}</button><p role="status">{{message}}</p>
 <p>{{t('این فرم فقط پیش‌نویس شخصی شما را ذخیره می‌کند؛ تغییر مدیر یا واحد در اینجا هیچ دسترسی جدیدی ایجاد نمی‌کند.','This saves only your personal draft. Editing a manager or department does not grant access to anyone’s records.')}}</p>
 </div></article></section>`
})
export class Organization {
 private lang=inject(LanguageService);
 private profiles=inject(EmploymentProfileService);
 get fa(){return this.lang.currentLanguage==='fa'}
 t(fa:string,en:string){return this.fa?fa:en}
 form:Omit<EmploymentProfile,'ownerId'|'verification'>={employeeCode:'',department:'',team:'',jobTitle:'',managerName:'',startDate:'',employmentType:'full-time'};
 message=''; error='';
 constructor(){const saved=this.profiles.current;if(saved){const {ownerId,verification,...fields}=saved;this.form=fields}}
 save(){
  this.error=''; this.message='';
  const values=[this.form.employeeCode,this.form.jobTitle,this.form.department,this.form.team,this.form.managerName];
  if(values.some(x=>String(x).length>120)){
   this.error=this.t('حداکثر طول هر فیلد ۱۲۰ نویسه است.','Each field must be at most 120 characters.');return;
  }
  if(this.form.startDate && !this.validDate(this.form.startDate)){
   this.error=this.t('تاریخ شروع همکاری معتبر نیست.','Invalid employment start date.');return;
  }
  this.message=this.profiles.save(this.form)?this.t('پیش‌نویس ذخیره شد.','Draft saved.'):this.t('ذخیره ناموفق بود؛ وارد حساب شوید.','Could not save; please sign in.');
 }
 private validDate(value:string):boolean{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const [y,m,d]=value.split('-').map(Number);
  const parsed=new Date(y,m-1,d);
  return parsed.getFullYear()===y && parsed.getMonth()===m-1 && parsed.getDate()===d;
 }
}
