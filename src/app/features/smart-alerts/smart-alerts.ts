import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import moment from 'moment-jalaali';
import { LanguageService } from '../../core/i18n/language.service';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { AccessControlService } from '../../core/auth/access-control.service';

type Priority = 'critical'|'high'|'medium';
interface Employee { id:string; firstName:string; lastName:string; employeeCode:string; status:string; department?:string; contractEnd?:string; }
interface AlertState { id:string; read:boolean; }
interface ContractAlert { id:string; employee:Employee; priority:Priority; days:number; end:string; read:boolean; }
@Component({selector:'app-smart-alerts',standalone:true,imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./smart-alerts.html',styleUrl:'./smart-alerts.css'})
export class SmartAlerts implements OnInit {
  private readonly records=inject(PersonalRecordsService);
  private readonly access=inject(AccessControlService);
  readonly lang=inject(LanguageService);
  alerts:ContractAlert[]=[];
  filter:'all'|'unread'|'critical'|'high'|'medium'='all';
  query='';
  error='';
  get fa():boolean {return this.lang.currentLanguage==='fa';}
  t(fa:string,en:string):string{return this.fa?fa:en;}
  ngOnInit():void{this.refresh();}
  refresh():void{
    const employees=this.records.read<Employee>('employee-directory-v1');
    const states=this.records.read<AlertState>('contract-alert-state-v1');
    const readIds=new Set(states.filter(s=>s.read).map(s=>s.id));
    const now=new Date();now.setHours(0,0,0,0);
    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const dayMs=86400000;
    this.alerts=employees.filter(e=>e&&typeof e.id==='string'&&e.status==='active'&&!!e.contractEnd&&moment(e.contractEnd,'YYYY-MM-DD',true).isValid())
      .map(e=>{
        const [year,month,day]=e.contractEnd!.split('-').map(Number);
        const endUtc=Date.UTC(year,month-1,day);
        const todayUtc=Date.UTC(today.getFullYear(),today.getMonth(),today.getDate());
        const days=Math.round((endUtc-todayUtc)/dayMs);
        const priority:Priority=days<0?'critical':days<=14?'high':'medium';
        return {id:`contract-expiry:${e.id}:${e.contractEnd}`,employee:e,priority,days,end:e.contractEnd!,read:readIds.has(`contract-expiry:${e.id}:${e.contractEnd}`)};
      }).filter(a=>a.days<=60).sort((a,b)=>a.days-b.days);
  }
  get visible():ContractAlert[]{const q=this.query.trim().toLocaleLowerCase();return this.alerts.filter(a=>(this.filter==='all'||(this.filter==='unread'?!a.read:a.priority===this.filter))&&(!q||[a.employee.firstName,a.employee.lastName,a.employee.employeeCode,a.employee.department||''].join(' ').toLocaleLowerCase().includes(q)));}
  get unread():number{return this.alerts.filter(a=>!a.read).length;}
  get critical():number{return this.alerts.filter(a=>a.priority==='critical').length;}
  get high():number{return this.alerts.filter(a=>a.priority==='high').length;}
  get medium():number{return this.alerts.filter(a=>a.priority==='medium').length;}
  get canViewEmployees():boolean{return this.access.can('employees.view');}
  date(value:string):string{const d=moment(value,'YYYY-MM-DD',true);return d.isValid()?d.format(this.fa?'jYYYY/jMM/jDD':'YYYY-MM-DD'):'—';}
  label(a:ContractAlert):string{return a.days<0?this.t(`${Math.abs(a.days)} روز از انقضا گذشته`,`Expired ${Math.abs(a.days)} days ago`):a.days===0?this.t('امروز منقضی می‌شود','Expires today'):this.t(`${a.days} روز تا انقضا`,`${a.days} days remaining`);}
  priorityLabel(p:Priority):string{return p==='critical'?this.t('بحرانی','Critical'):p==='high'?this.t('بالا','High'):this.t('متوسط','Medium');}
  mark(a:ContractAlert):void{
    const existing=this.records.read<AlertState>('contract-alert-state-v1').filter(s=>s&&typeof s.id==='string'&&s.id!==a.id);
    if(this.records.write('contract-alert-state-v1',[...existing,{id:a.id,read:!a.read}])){a.read=!a.read;this.error='';}
    else this.error=this.t('ذخیره وضعیت هشدار انجام نشد.','Unable to save alert status.');
  }
  markAll():void{
    const existing=this.records.read<AlertState>('contract-alert-state-v1');
    const merged=new Map(existing.filter(s=>s&&typeof s.id==='string').map(s=>[s.id,s]));
    this.alerts.forEach(a=>merged.set(a.id,{id:a.id,read:true}));
    if(this.records.write('contract-alert-state-v1',Array.from(merged.values()))){this.alerts.forEach(a=>a.read=true);this.error='';}
    else this.error=this.t('ذخیره وضعیت هشدار انجام نشد.','Unable to save alert status.');
  }
}
