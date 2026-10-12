import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import moment from 'moment-jalaali';
import { LanguageService } from '../../core/i18n/language.service';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { AccessControlService } from '../../core/auth/access-control.service';

type Priority = 'critical'|'high'|'medium';
interface Employee { id:string; firstName:string; lastName:string; employeeCode:string; department?:string; status:string; contractEnd?:string; }
interface AlertState { id:string; read:boolean; }
interface InboxAlert { id:string; employee:Employee; days:number; priority:Priority; read:boolean; end:string; }
@Component({selector:'app-notification-inbox',standalone:true,imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./notification-inbox.html',styleUrl:'./notification-inbox.css'})
export class NotificationInbox implements OnInit {
  readonly lang=inject(LanguageService);
  private readonly records=inject(PersonalRecordsService);
  private readonly access=inject(AccessControlService);
  alerts:InboxAlert[]=[];
  query=''; filter:'all'|'unread'|'critical'|'high'|'medium'='all'; error='';
  get isFa():boolean{return this.lang.currentLanguage==='fa';}
  t(fa:string,en:string):string{return this.isFa?fa:en;}
  ngOnInit():void{this.refresh();}
  refresh():void {
    const employees=this.records.read<Employee>('employee-directory-v1');
    const readIds=new Set(this.records.read<AlertState>('contract-alert-state-v1').filter(s=>s&&s.read).map(s=>s.id));
    const today=new Date();
    const todayUtc=Date.UTC(today.getFullYear(),today.getMonth(),today.getDate());
    this.alerts=employees.filter(e=>e&&e.status==='active'&&typeof e.id==='string'&&!!e.contractEnd&&moment(e.contractEnd,'YYYY-MM-DD',true).isValid())
      .map(e=>{
        const [y,m,d]=e.contractEnd!.split('-').map(Number);
        const days=Math.round((Date.UTC(y,m-1,d)-todayUtc)/86400000);
        const priority:Priority=days<0?'critical':days<=14?'high':'medium';
        const id=`contract-expiry:${e.id}:${e.contractEnd}`;
        return {id,employee:e,days,priority,read:readIds.has(id),end:e.contractEnd!};
      }).filter(a=>a.days<=60).sort((a,b)=>a.days-b.days);
  }
  get visible():InboxAlert[]{const q=this.query.trim().toLocaleLowerCase();return this.alerts.filter(a=>(this.filter==='all'||(this.filter==='unread'?!a.read:a.priority===this.filter))&&(!q||[a.employee.firstName,a.employee.lastName,a.employee.employeeCode,a.employee.department||''].join(' ').toLocaleLowerCase().includes(q)));}
  get unread():number{return this.alerts.filter(a=>!a.read).length;}
  get critical():number{return this.alerts.filter(a=>a.priority==='critical').length;}
  get high():number{return this.alerts.filter(a=>a.priority==='high').length;}
  get canViewEmployees():boolean{return this.access.can('employees.view');}
  date(iso:string):string{const d=moment(iso,'YYYY-MM-DD',true);return d.isValid()?d.format(this.isFa?'jYYYY/jMM/jDD':'YYYY-MM-DD'):'—';}
  priorityLabel(p:Priority):string{return p==='critical'?this.t('بحرانی','Critical'):p==='high'?this.t('بالا','High'):this.t('متوسط','Medium');}
  description(a:InboxAlert):string{return a.days<0?this.t(`${Math.abs(a.days)} روز از انقضا گذشته`,`Expired ${Math.abs(a.days)} days ago`):a.days===0?this.t('امروز منقضی می‌شود','Expires today'):this.t(`${a.days} روز تا پایان قرارداد`,`${a.days} days until expiry`);}
  mark(a:InboxAlert):void{
    const states=this.records.read<AlertState>('contract-alert-state-v1').filter(s=>s&&typeof s.id==='string'&&s.id!==a.id);
    if(this.records.write('contract-alert-state-v1',[...states,{id:a.id,read:!a.read}])){a.read=!a.read;this.error='';}
    else this.error=this.t('ذخیره وضعیت اعلان ناموفق بود.','Could not save notification status.');
  }
  markAll():void{
    const states=new Map(this.records.read<AlertState>('contract-alert-state-v1').filter(s=>s&&typeof s.id==='string').map(s=>[s.id,s]));
    this.alerts.forEach(a=>states.set(a.id,{id:a.id,read:true}));
    if(this.records.write('contract-alert-state-v1',Array.from(states.values()))){this.alerts.forEach(a=>a.read=true);this.error='';}
    else this.error=this.t('ذخیره وضعیت اعلان ناموفق بود.','Could not save notification status.');
  }
}
