import { CommonModule, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { AccessControlService } from '../../core/auth/access-control.service';
@Component({selector:'app-dashboard',standalone:true,templateUrl:'./dashboard.html',styleUrl:'./dashboard.css',imports:[CommonModule,RouterModule]})
export class Dashboard {
 private platformId=inject(PLATFORM_ID); constructor(public language:LanguageService, public access:AccessControlService){}
 get canCreateEmployee(){return this.access.can('employees.create')}
 get canViewRequests(){return this.access.can('requests.view')}
 get canViewAnalytics(){return this.access.can('analytics.view')}
 get canViewPayroll(){return this.access.can('payroll.view')}
 get roleLabel(){const role=this.access.policy();return this.isFa?role.fa:role.en}
 get userName():string { if (!isPlatformBrowser(this.platformId)) return this.isFa ? 'کاربر' : 'User'; try { return localStorage.getItem('userName') || (this.isFa ? 'کاربر' : 'User'); } catch { return this.isFa ? 'کاربر' : 'User'; } } get isFa(){return this.language.currentLanguage==='fa'}; t(fa:string,en:string){return this.isFa?fa:en}
 get today(){return new Intl.DateTimeFormat(this.isFa?'fa-IR-u-ca-persian':'en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(new Date())}
 get stats(){return this.isFa?[{title:'کارکنان فعال',value:'128',trend:'+4.2%',icon:'groups',tone:'blue'},{title:'حضور امروز',value:'93%',trend:'+1.8%',icon:'how_to_reg',tone:'green'},{title:'درخواست در انتظار',value:'12',trend:'نیازمند بررسی',icon:'pending_actions',tone:'amber'},{title:'موقعیت شغلی باز',value:'7',trend:'34 متقاضی',icon:'work',tone:'violet'}]:[{title:'Active employees',value:'128',trend:'+4.2%',icon:'groups',tone:'blue'},{title:'Attendance today',value:'93%',trend:'+1.8%',icon:'how_to_reg',tone:'green'},{title:'Pending requests',value:'12',trend:'Needs review',icon:'pending_actions',tone:'amber'},{title:'Open positions',value:'7',trend:'34 applicants',icon:'work',tone:'violet'}]}
 get quickActions(){const actions = this.isFa?[{title:'ثبت مرخصی',icon:'event_available',link:'/app/leave'},{title:'ثبت ماموریت',icon:'flight_takeoff',link:'/app/mission'},{title:'ثبت اضافه‌کاری',icon:'more_time',link:'/app/overtime'},{title:'مشاهده فیش حقوقی',icon:'receipt_long',link:'/app/salary-slip'}]:[{title:'Request leave',icon:'event_available',link:'/app/leave'},{title:'Create mission',icon:'flight_takeoff',link:'/app/mission'},{title:'Log overtime',icon:'more_time',link:'/app/overtime'},{title:'View payslip',icon:'receipt_long',link:'/app/salary-slip'}]; return actions.filter(action => action.link !== '/app/salary-slip' || this.canViewPayroll || this.access.can('selfservice.view')); }
 get attendanceDescription():string { return this.t('نمودار نمایشی حضور هفت روز گذشته: ','Demo attendance trend for seven days: ') + this.attendance.map(value => value + '%').join(', '); }
 attendance=[72,84,78,91,88,93,86]; get dayLabels(){return this.isFa?['ش','ی','د','س','چ','پ','ج']:['S','S','M','T','W','T','F']}
 get recentRequests(){return this.isFa?[{user:'علی رضایی',type:'مرخصی استحقاقی',date:'۱۴۰۵/۰۷/۰۲',status:'pending'},{user:'مریم احمدی',type:'اضافه‌کاری',date:'۱۴۰۵/۰۷/۰۱',status:'accepted'}]:[{user:'Ali Rezaei',type:'Annual leave',date:'2026/09/24',status:'pending'},{user:'Maryam Ahmadi',type:'Overtime',date:'2026/09/23',status:'accepted'}]}
 statusLabel(s:string){return s==='pending'?this.t('در انتظار','Pending'):s==='accepted'?this.t('تایید شده','Approved'):this.t('رد شده','Rejected')}
}
