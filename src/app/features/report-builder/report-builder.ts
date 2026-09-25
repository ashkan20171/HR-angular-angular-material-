import { LocaleDatePipe } from '../../shared/locale-date.pipe';
import { CommonModule } from '@angular/common';import { Component } from '@angular/core';import { FormsModule } from '@angular/forms';import { LanguageService } from '../../core/i18n/language.service';
interface Report {id:number;nameFa:string;nameEn:string;source:string;fields:string[];created:Date}
@Component({selector:'app-report-builder',standalone:true,imports:[CommonModule,FormsModule,LocaleDatePipe],templateUrl:'./report-builder.html'}) export class ReportBuilder{
 reports:Report[]=[{id:1,nameFa:'گزارش وضعیت قراردادها',nameEn:'Contract status report',source:'employees',fields:['employee','department','contractEnd'],created:new Date()}]; draft:Report|null=null;
 constructor(public language:LanguageService){} get fa(){return this.language.currentLanguage==='fa'} t(f:string,e:string){return this.fa?f:e}
 add(){this.draft={id:Date.now(),nameFa:'',nameEn:'',source:'employees',fields:['employee'],created:new Date()}}
 save(){if(!this.draft)return;this.reports.unshift({...this.draft});this.draft=null}
 remove(id:number){this.reports=this.reports.filter(x=>x.id!==id)}
 toggle(field:string){if(!this.draft)return;this.draft.fields=this.draft.fields.includes(field)?this.draft.fields.filter(x=>x!==field):[...this.draft.fields,field]}
}
