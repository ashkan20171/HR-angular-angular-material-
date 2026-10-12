import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { AccessControlService } from '../../core/auth/access-control.service';
import { LanguageService } from '../../core/i18n/language.service';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';
interface TimeEntry { id:number; date:string; project:string; hours:number; note:string; status:'draft'|'submitted'|'approved' }
@Component({selector:'app-timesheets',standalone:true,imports:[CommonModule,FormsModule,LocaleDatePipe],templateUrl:'./timesheets.html',styleUrl:'./timesheets.css'})
export class Timesheets {
 get entries():TimeEntry[]{return this.records.read<TimeEntry>('timesheets')}
 set entries(items:TimeEntry[]){this.records.write('timesheets',items)}
 form={date:'',project:'',hours:8,note:''}; constructor(public lang:LanguageService,private records:PersonalRecordsService,private access:AccessControlService){}
 get canApprove(){return this.access.can('timesheets.approve') && this.access.scope()!=='own'} get fa(){return this.lang.currentLanguage==='fa'}
 get total(){return this.entries.reduce((s,x)=>s+x.hours,0)}
 add(){if(!this.form.date||!this.form.project||this.form.hours<=0)return;this.entries=[{id:Date.now(),...this.form,status:'draft'},...this.entries];this.form={date:'',project:'',hours:8,note:''}}
 submit(x:TimeEntry){this.entries=this.entries.map(e=>e.id===x.id?{...e,status:'submitted'}:e)} approve(x:TimeEntry){if(!this.canApprove)return;this.entries=this.entries.map(e=>e.id===x.id?{...e,status:'approved'}:e)} remove(id:number){this.entries=this.entries.filter(x=>x.id!==id)}
}