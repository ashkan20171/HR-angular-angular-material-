import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';

@Component({selector:'app-employee-relations',standalone:true,imports:[CommonModule,FormsModule,LocaleDatePipe],templateUrl:'./employee-relations.html',styleUrl:'./employee-relations.css'})
export class EmployeeRelations {
  query=''; showForm=false; nextId=4;
  rows=[
    {id:1,nameFa:'نمونه شماره یک',nameEn:'Sample item one',owner:'HR',statusFa:'فعال',statusEn:'Active',date:'2026-09-25'},
    {id:2,nameFa:'نمونه شماره دو',nameEn:'Sample item two',owner:'Manager',statusFa:'در انتظار',statusEn:'Pending',date:'2026-10-05'},
    {id:3,nameFa:'نمونه شماره سه',nameEn:'Sample item three',owner:'People Ops',statusFa:'بررسی',statusEn:'Review',date:'2026-11-01'}
  ];
  draft={nameFa:'',nameEn:'',owner:'HR',date:new Date().toISOString().slice(0,10)};
  constructor(public language:LanguageService){}
  get isFa(){return this.language.currentLanguage==='fa'}
  t(fa:string,en:string){return this.isFa?fa:en}
  get filtered(){const q=this.query.trim().toLowerCase();return !q?this.rows:this.rows.filter(x=>(x.nameFa+' '+x.nameEn+' '+x.owner).toLowerCase().includes(q))}
  add(){if(!this.draft.nameFa&&!this.draft.nameEn)return;this.rows=[...this.rows,{id:this.nextId++,nameFa:this.draft.nameFa||this.draft.nameEn,nameEn:this.draft.nameEn||this.draft.nameFa,owner:this.draft.owner,statusFa:'فعال',statusEn:'Active',date:this.draft.date}];this.draft={nameFa:'',nameEn:'',owner:'HR',date:new Date().toISOString().slice(0,10)};this.showForm=false}
  remove(id:number){this.rows=this.rows.filter(x=>x.id!==id)}
}
