import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment-jalaali';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { LanguageService } from '../../core/i18n/language.service';

interface EmployeeProfile {
  id: string; firstName: string; lastName: string; employeeCode: string;
  email?: string; phone?: string; department?: string; jobTitle?: string;
  hireDate?: string; status?: 'active'|'leave'|'inactive'; notes?: string;
  employmentType?: string; contractStart?: string; contractEnd?: string;
  manager?: string; location?: string;
}
interface HistoryEntry {id:string;employeeId:string;employeeCode:string;at:string;action:'created'|'updated'|'deleted';before:EmployeeProfile|null;after:EmployeeProfile|null}
type ProfileTab = 'personal'|'employment'|'contract'|'history';
type HistoryFilter = 'all'|'created'|'updated'|'deleted';
@Component({selector:'app-employee-360',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./employee-360.html',styleUrl:'./employee-360.css'})
export class Employee360 implements OnInit {
  private readonly records=inject(PersonalRecordsService);
  readonly language=inject(LanguageService);
  employees:EmployeeProfile[]=[];history:HistoryEntry[]=[];
  query=''; selectedId=''; tab:ProfileTab='personal';
  historyFilter:HistoryFilter='all'; historyQuery=''; historyScope:'selected'|'all'='selected'; compareId='';
  get fa(){return this.language.currentLanguage==='fa'}
  t(fa:string,en:string){return this.fa?fa:en}
  ngOnInit(){this.employees=this.records.read<EmployeeProfile>('employee-directory-v1').filter(e=>e&&typeof e.id==='string'&&typeof e.employeeCode==='string');this.history=this.records.read<HistoryEntry>('employee-history-v1').filter(h=>h&&typeof h.employeeId==='string'&&typeof h.at==='string');this.selectedId=this.employees[0]?.id??''}
  get visible(){const q=this.query.trim().toLocaleLowerCase();return this.employees.filter(e=>!q||[e.firstName,e.lastName,e.employeeCode,e.department,e.jobTitle].join(' ').toLocaleLowerCase().includes(q))}
  get selectedHistory(){return this.history.filter(h=>h.employeeId===this.selectedId).sort((a,b)=>b.at.localeCompare(a.at))}
  get filteredHistory(){const q=this.historyQuery.trim().toLocaleLowerCase();return this.history.filter(h=>
    (this.historyScope==='all'||h.employeeId===this.selectedId)&&
    (this.historyFilter==='all'||h.action===this.historyFilter)&&
    (!q||[h.employeeCode,this.historyName(h),h.action,...this.historyChanges(h)].join(' ').toLocaleLowerCase().includes(q))
  ).sort((a,b)=>b.at.localeCompare(a.at));}
  get contractVersions(){
    const events=this.selectedHistory.filter(h=>h.before||h.after);
    const versions:{at:string;start:string;end:string;source:string}[]=[];
    for(const event of events){
      const snapshot=event.after??event.before;
      if(!snapshot?.contractStart&&!snapshot?.contractEnd)continue;
      const start=snapshot.contractStart??'';const end=snapshot.contractEnd??'';
      if(versions.some(v=>v.start===start&&v.end===end))continue;
      versions.push({at:event.at,start,end,source:event.action});
    }
    const current=this.selected;
    if(current&&(current.contractStart||current.contractEnd)&&!versions.some(v=>v.start===(current.contractStart??'')&&v.end===(current.contractEnd??'')))
      versions.unshift({at:'',start:current.contractStart??'',end:current.contractEnd??'',source:'current'});
    return versions;
  }
  get contractRenewals(){return this.contractVersions.length>0?this.contractVersions.length-1:0}
  get deletedHistoryCount(){return this.history.filter(h=>h.action==='deleted').length}
  historyName(h:HistoryEntry){const snapshot=h.after??h.before;return snapshot?[snapshot.firstName,snapshot.lastName].filter(Boolean).join(' ')||h.employeeCode:h.employeeCode}
  get comparison(){return this.history.find(h=>h.id===this.compareId)??null}
  get comparisonRows(){const h=this.comparison;if(!h)return [];
    const fields:[keyof EmployeeProfile,string,string][]=[['firstName','نام','First name'],['lastName','نام خانوادگی','Last name'],['employeeCode','کد پرسنلی','Employee code'],['department','واحد','Department'],['jobTitle','سمت','Job title'],['status','وضعیت','Status'],['manager','مدیر','Manager'],['location','محل خدمت','Location'],['employmentType','نوع همکاری','Employment type'],['contractStart','شروع قرارداد','Contract start'],['contractEnd','پایان قرارداد','Contract end'],['hireDate','تاریخ استخدام','Hire date'],['email','ایمیل','Email'],['phone','تلفن','Phone'],['notes','یادداشت','Notes']];
    return fields.filter(([key])=>h.before?.[key]!==h.after?.[key]).map(([key,fa,en])=>({label:this.t(fa,en),before:String(h.before?.[key]??'—'),after:String(h.after?.[key]??'—')}));
  }
  showComparison(h:HistoryEntry){this.compareId=this.compareId===h.id?'':h.id}
  exportHistory(){const rows=this.filteredHistory;const quote=(v:string)=>'"'+v.replace(/"/g,'""')+'"';const headers=this.fa?['زمان','کد پرسنلی','نام','رویداد','فیلدهای تغییرکرده']:['Timestamp','Employee code','Employee','Action','Changed fields'];
    const lines=[headers,...rows.map(h=>[this.formatTimestamp(h.at),h.employeeCode,this.historyName(h),this.historyLabel(h.action),this.historyChanges(h).join(', ')])].map(row=>row.map(v=>quote(String(v))).join(','));
    const blob=new Blob(['\uFEFF'+lines.join('\r\n')],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ashkanhr-employee-history.csv';a.click();URL.revokeObjectURL(url);
  }
  historyLabel(action:string){return action==='created'?this.t('ایجاد پرونده','Record created'):action==='deleted'?this.t('حذف پرونده','Record deleted'):this.t('ویرایش پرونده','Record updated')}
  historyChanges(h:HistoryEntry):string[]{if(!h.before||!h.after)return [];const fields:[keyof EmployeeProfile,string,string][]=[['firstName','نام','First name'],['lastName','نام خانوادگی','Last name'],['employeeCode','کد پرسنلی','Employee code'],['department','واحد','Department'],['jobTitle','سمت','Job title'],['status','وضعیت','Status'],['manager','مدیر','Manager'],['location','محل خدمت','Location'],['employmentType','نوع همکاری','Employment type'],['contractStart','شروع قرارداد','Contract start'],['contractEnd','پایان قرارداد','Contract end'],['hireDate','تاریخ استخدام','Hire date'],['email','ایمیل','Email'],['phone','تلفن','Phone']];return fields.filter(([key])=>h.before?.[key]!==h.after?.[key]).map(([,fa,en])=>this.t(fa,en))}
  formatTimestamp(value:string){const d=moment(value);return d.isValid()?(this.fa?d.format('jYYYY/jMM/jDD HH:mm'):d.format('YYYY-MM-DD HH:mm')):'—'}
  get selected(){return this.employees.find(e=>e.id===this.selectedId)??null}
  select(id:string){this.selectedId=id;this.tab='personal';this.historyScope='selected';this.compareId=''}
  formatDate(value?:string){if(!value)return '—';const d=moment(value,'YYYY-MM-DD',true);return d.isValid()?(this.fa?d.format('jYYYY/jMM/jDD'):d.format('YYYY-MM-DD')):'—'}
  get active(){return this.employees.filter(e=>e.status==='active').length}
  get departments(){return new Set(this.employees.map(e=>e.department?.trim()).filter(Boolean)).size}
  get contractState(){const e=this.selected;if(!e?.contractEnd)return this.t('بدون تاریخ پایان','No end date');const today=new Date();const current=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');if(e.contractEnd<current)return this.t('منقضی شده','Expired');const limit=new Date(today);limit.setDate(limit.getDate()+60);const upper=[limit.getFullYear(),String(limit.getMonth()+1).padStart(2,'0'),String(limit.getDate()).padStart(2,'0')].join('-');return e.contractEnd<=upper?this.t('رو به پایان','Ending soon'):this.t('معتبر','Valid')}
  statusLabel(value?:string){return value==='active'?this.t('فعال','Active'):value==='leave'?this.t('مرخصی','On leave'):value==='inactive'?this.t('غیرفعال','Inactive'):'—'}
  typeLabel(value?:string){const map:Record<string,[string,string]>={'full-time':['تمام‌وقت','Full-time'],'part-time':['پاره‌وقت','Part-time'],contract:['قراردادی','Contract'],intern:['کارآموز','Intern']};const pair=value?map[value]:undefined;return pair?this.t(pair[0],pair[1]):value||'—'}
}
