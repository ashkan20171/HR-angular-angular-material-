import { CommonModule } from '@angular/common';import { Component } from '@angular/core';import { FormsModule } from '@angular/forms';import { LanguageService } from '../../core/i18n/language.service';
interface Kpi{id:number;nameFa:string;nameEn:string;target:number;unit:string;owner:string;weight:number;active:boolean}
@Component({selector:'app-kpi-designer',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./kpi-designer.html'}) export class KpiDesigner{
 kpis:Kpi[]=[{id:1,nameFa:'نرخ ماندگاری کارکنان',nameEn:'Employee retention rate',target:92,unit:'%',owner:'HR',weight:25,active:true}];draft:Kpi|null=null;
 constructor(public language:LanguageService){}get fa(){return this.language.currentLanguage==='fa'}t(f:string,e:string){return this.fa?f:e} add(){this.draft={id:Date.now(),nameFa:'',nameEn:'',target:0,unit:'%',owner:'HR',weight:10,active:true}} save(){if(!this.draft)return;this.kpis.push({...this.draft});this.draft=null} remove(id:number){this.kpis=this.kpis.filter(x=>x.id!==id)}
}
