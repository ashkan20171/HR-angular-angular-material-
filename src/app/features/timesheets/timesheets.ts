import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';
interface TimeEntry { id:number; date:string; project:string; hours:number; note:string; status:'draft'|'submitted'|'approved' }
@Component({selector:'app-timesheets',standalone:true,imports:[CommonModule,FormsModule,LocaleDatePipe],templateUrl:'./timesheets.html',styleUrl:'./timesheets.css'})
export class Timesheets {
 entries:TimeEntry[]=[{id:1,date:'2026-09-24',project:'AshkanHR',hours:7.5,note:'Workflow & permissions',status:'approved'}];
 form={date:'',project:'',hours:8,note:''}; constructor(public lang:LanguageService){} get fa(){return this.lang.currentLanguage==='fa'}
 get total(){return this.entries.reduce((s,x)=>s+x.hours,0)}
 add(){if(!this.form.date||!this.form.project||this.form.hours<=0)return;this.entries.unshift({id:Date.now(),...this.form,status:'draft'});this.form={date:'',project:'',hours:8,note:''}}
 submit(x:TimeEntry){x.status='submitted'} approve(x:TimeEntry){x.status='approved'} remove(id:number){this.entries=this.entries.filter(x=>x.id!==id)}
}