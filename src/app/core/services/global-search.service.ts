import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
export interface SearchAction { titleFa:string; titleEn:string; subtitleFa:string; subtitleEn:string; icon:string; route:string; keywords:string[]; }
@Injectable({providedIn:'root'}) export class GlobalSearchService {
 actions: SearchAction[] = [
  {titleFa:'داشبورد',titleEn:'Dashboard',subtitleFa:'نمای کلی سازمان',subtitleEn:'Organization overview',icon:'space_dashboard',route:'/app/dashboard',keywords:['home','kpi']},
  {titleFa:'کارکنان',titleEn:'Employees',subtitleFa:'مدیریت و جستجوی کارکنان',subtitleEn:'Manage and find employees',icon:'groups',route:'/app/users',keywords:['people','staff']},
  {titleFa:'حضور و غیاب',titleEn:'Attendance',subtitleFa:'ثبت و گزارش تردد',subtitleEn:'Time & attendance',icon:'schedule',route:'/app/attendance',keywords:['time','clock']},
  {titleFa:'درخواست‌ها',titleEn:'Requests',subtitleFa:'مرخصی، ماموریت و سایر درخواست‌ها',subtitleEn:'Leave, mission and HR requests',icon:'assignment',route:'/app/requests',keywords:['leave','mission']},
  {titleFa:'مرکز تاییدها',titleEn:'Approval center',subtitleFa:'اقدامات نیازمند تایید شما',subtitleEn:'Items waiting for approval',icon:'approval',route:'/app/approvals',keywords:['workflow','approve']},
  {titleFa:'تحلیل منابع انسانی',titleEn:'People analytics',subtitleFa:'شاخص‌ها و بینش‌های نیروی انسانی',subtitleEn:'People metrics and insights',icon:'query_stats',route:'/app/analytics',keywords:['analytics','report']},
  {titleFa:'دستیار HR',titleEn:'HR Assistant',subtitleFa:'پرسش از دستیار منابع انسانی',subtitleEn:'Ask the HR assistant',icon:'smart_toy',route:'/app/chat',keywords:['ai','assistant']}
 ];
 constructor(private router:Router){} search(q:string){const n=q.trim().toLowerCase();return !n?this.actions:this.actions.filter(a=>[a.titleFa,a.titleEn,a.subtitleFa,a.subtitleEn,...a.keywords].some(v=>v.toLowerCase().includes(n)));} go(a:SearchAction){this.router.navigateByUrl(a.route);}
}
