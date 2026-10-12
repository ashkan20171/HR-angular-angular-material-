import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AccessControlService } from '../auth/access-control.service';

export interface SearchAction {
 titleFa:string; titleEn:string; subtitleFa:string; subtitleEn:string;
 icon:string; route:string; keywords:string[]; permission?:string; roles?:string[];
}
@Injectable({providedIn:'root'})
export class GlobalSearchService {
 private router=inject(Router);
 private auth=inject(AuthService);
 private access=inject(AccessControlService);
 readonly actions:SearchAction[]=[
  {titleFa:'تنظیمات شخصی',titleEn:'Personal preferences',subtitleFa:'زبان و ظاهر',subtitleEn:'Language and appearance',icon:'tune',route:'/app/personal-preferences',keywords:['settings','theme','dark','language']},
  {titleFa:'مرکز شخصی',titleEn:'Personal hub',subtitleFa:'میان‌برها و آمار شخصی',subtitleEn:'Personal shortcuts and counts',icon:'dashboard_customize',route:'/app/personal-hub',keywords:['home','personal','workspace']},
  {titleFa:'کارهای شخصی',titleEn:'My tasks',subtitleFa:'مدیریت کارهای من',subtitleEn:'My private task list',icon:'checklist',route:'/app/my-workspace',keywords:['tasks','todo']},
  {titleFa:'پروفایل من',titleEn:'My profile',subtitleFa:'اطلاعات حساب من',subtitleEn:'My account information',icon:'person',route:'/app/profile',keywords:['account','profile']},
  {titleFa:'اعلان‌های شخصی',titleEn:'Personal notifications',subtitleFa:'یادداشت‌ها و اعلان‌های من',subtitleEn:'My notes and notifications',icon:'notifications',route:'/app/notifications',keywords:['notes','alerts']},
  {titleFa:'داشبورد',titleEn:'Dashboard',subtitleFa:'نمای کلی',subtitleEn:'Overview',icon:'space_dashboard',route:'/app/dashboard',keywords:['home','kpi'],permission:'dashboard.view'},
  {titleFa:'کارکنان',titleEn:'Employees',subtitleFa:'مدیریت کارکنان',subtitleEn:'Employee administration',icon:'groups',route:'/app/users',keywords:['people','staff'],permission:'employees.view'},
  {titleFa:'حضور و غیاب',titleEn:'Attendance',subtitleFa:'ثبت و گزارش تردد',subtitleEn:'Time & attendance',icon:'schedule',route:'/app/attendance',keywords:['time','clock']},
  {titleFa:'درخواست‌ها',titleEn:'Requests',subtitleFa:'درخواست‌های منابع انسانی',subtitleEn:'HR requests',icon:'assignment',route:'/app/requests',keywords:['leave','mission']},
  {titleFa:'مرخصی من',titleEn:'My leave',subtitleFa:'درخواست‌های مرخصی',subtitleEn:'Leave requests',icon:'event_available',route:'/app/leave',keywords:['vacation']},
  {titleFa:'مأموریت من',titleEn:'My missions',subtitleFa:'درخواست‌های مأموریت',subtitleEn:'Mission requests',icon:'flight_takeoff',route:'/app/mission',keywords:['travel']},
  {titleFa:'مرکز تأییدها',titleEn:'Approval center',subtitleFa:'پیگیری تأییدها',subtitleEn:'Approval tracking',icon:'approval',route:'/app/approvals',keywords:['workflow','approve'],roles:['admin','manager','hr','accounting']},
  {titleFa:'تحلیل منابع انسانی',titleEn:'People analytics',subtitleFa:'شاخص‌های منابع انسانی',subtitleEn:'People metrics',icon:'query_stats',route:'/app/analytics',keywords:['analytics','report'],roles:['admin','manager','hr']},
  {titleFa:'مدارک شخصی',titleEn:'My documents',subtitleFa:'فهرست مدارک من',subtitleEn:'My document records',icon:'folder_open',route:'/app/document-vault',keywords:['vault','documents'],permission:'vault.view'},
  {titleFa:'دستیار HR',titleEn:'HR Assistant',subtitleFa:'دستیار منابع انسانی',subtitleEn:'HR assistant',icon:'smart_toy',route:'/app/chat',keywords:['ai','assistant']}
 ];
 private permitted(a:SearchAction):boolean {
  if(!this.auth.isLoggedIn)return false;
  if(a.roles && !a.roles.includes(this.auth.role))return false;
  return !a.permission || this.access.can(a.permission);
 }
 search(q:string):SearchAction[]{
  const n=q.trim().toLocaleLowerCase();
  return this.actions.filter(a=>this.permitted(a)&&(!n||
   [a.titleFa,a.titleEn,a.subtitleFa,a.subtitleEn,...a.keywords].some(v=>v.toLocaleLowerCase().includes(n))));
 }
 go(a:SearchAction):void {
  if(this.permitted(a)&&this.actions.includes(a))void this.router.navigateByUrl(a.route);
 }
}
