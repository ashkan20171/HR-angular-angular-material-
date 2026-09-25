import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';

type Step={id:number;fa:string;en:string;role:string;sla:number};
type Flow={id:number;fa:string;en:string;enabled:boolean;steps:Step[]};
@Component({selector:'app-workflow-builder',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./workflow-builder.html',styleUrl:'./workflow-builder.css'})
export class WorkflowBuilder{
 private platformId=inject(PLATFORM_ID); private key='ashkanhr.workflows.v1';
 flows:Flow[]=[]; selected=0;
 constructor(public lang:LanguageService){this.flows=this.load()}
 get isFa(){return this.lang.currentLanguage==='fa'} get current(){return this.flows[this.selected]}
 t(fa:string,en:string){return this.isFa?fa:en}
 addFlow(){this.flows=[...this.flows,{id:Date.now(),fa:'گردش کار جدید',en:'New workflow',enabled:true,steps:[]}];this.selected=this.flows.length-1;this.save()}
 addStep(){this.current.steps.push({id:Date.now(),fa:'مرحله جدید',en:'New step',role:'manager',sla:24});this.save()}
 removeStep(id:number){this.current.steps=this.current.steps.filter(x=>x.id!==id);this.save()}
 move(i:number,d:number){const j=i+d;if(j<0||j>=this.current.steps.length)return;[this.current.steps[i],this.current.steps[j]]=[this.current.steps[j],this.current.steps[i]];this.save()}
 save(){if(isPlatformBrowser(this.platformId))localStorage.setItem(this.key,JSON.stringify(this.flows))}
 private load():Flow[]{if(isPlatformBrowser(this.platformId)){try{const v=JSON.parse(localStorage.getItem(this.key)||'null');if(v)return v}catch{}}return [
  {id:1,fa:'تأیید مرخصی',en:'Leave approval',enabled:true,steps:[{id:11,fa:'تأیید سرپرست',en:'Supervisor approval',role:'supervisor',sla:8},{id:12,fa:'تأیید منابع انسانی',en:'HR approval',role:'hr-manager',sla:24}]},
  {id:2,fa:'تأیید هزینه',en:'Expense approval',enabled:true,steps:[{id:21,fa:'تأیید مدیر',en:'Manager approval',role:'manager',sla:12},{id:22,fa:'تأیید مالی',en:'Finance approval',role:'accounting',sla:24}]}
 ]}
}
