import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';
interface Widget { id:number; titleFa:string; titleEn:string; type:'metric'|'chart'|'list'; visible:boolean; size:'small'|'medium'|'large'; }
@Component({selector:'app-dashboard-widgets',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./dashboard-widgets.html'})
export class DashboardWidgets{
 widgets:Widget[]=[
  {id:1,titleFa:'تعداد کارکنان',titleEn:'Headcount',type:'metric',visible:true,size:'small'},
  {id:2,titleFa:'روند حضور',titleEn:'Attendance trend',type:'chart',visible:true,size:'large'},
  {id:3,titleFa:'تاییدهای من',titleEn:'My approvals',type:'list',visible:true,size:'medium'}
 ];
 draft:Widget|null=null;
 constructor(public language:LanguageService){} get fa(){return this.language.currentLanguage==='fa'} t(f:string,e:string){return this.fa?f:e}
 add(){this.draft={id:Date.now(),titleFa:'',titleEn:'',type:'metric',visible:true,size:'medium'}}
 save(){if(!this.draft)return;this.widgets.push({...this.draft});this.draft=null}
 remove(id:number){this.widgets=this.widgets.filter(x=>x.id!==id)}
 move(i:number,d:number){const n=i+d;if(n<0||n>=this.widgets.length)return;[this.widgets[i],this.widgets[n]]=[this.widgets[n],this.widgets[i]]}
}
