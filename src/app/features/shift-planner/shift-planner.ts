import { LocaleDatePipe } from '../../shared/locale-date.pipe';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';

interface Shift { id:number; employee:string; team:string; date:Date; start:string; end:string; type:'normal'|'remote'|'night'; }
@Component({selector:'app-shift-planner',standalone:true,imports:[CommonModule,FormsModule,LocaleDatePipe],templateUrl:'./shift-planner.html'})
export class ShiftPlanner {
  q=''; selected:Shift|null=null;
  shifts:Shift[]=[
    {id:1,employee:'علی رضایی',team:'فروش',date:new Date(),start:'08:00',end:'16:00',type:'normal'},
    {id:2,employee:'سارا محمدی',team:'منابع انسانی',date:new Date(Date.now()+86400000),start:'09:00',end:'17:00',type:'remote'}
  ];
  constructor(public language:LanguageService){}
  get fa(){return this.language.currentLanguage==='fa'}
  t(fa:string,en:string){return this.fa?fa:en}
  get filtered(){const x=this.q.trim().toLowerCase();return !x?this.shifts:this.shifts.filter(s=>(s.employee+' '+s.team).toLowerCase().includes(x))}
  add(){this.selected={id:Date.now(),employee:'',team:'',date:new Date(),start:'08:00',end:'16:00',type:'normal'}}
  edit(s:Shift){this.selected={...s}}
  save(){if(!this.selected?.employee.trim())return;const i=this.shifts.findIndex(x=>x.id===this.selected!.id);i>=0?this.shifts.splice(i,1,{...this.selected}):this.shifts.unshift({...this.selected});this.selected=null}
  remove(id:number){if(confirm(this.t('این شیفت حذف شود؟','Delete this shift?')))this.shifts=this.shifts.filter(x=>x.id!==id)}
}
