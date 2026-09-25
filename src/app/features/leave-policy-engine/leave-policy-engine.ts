import { CommonModule } from '@angular/common';import { Component } from '@angular/core';import { FormsModule } from '@angular/forms';import { LanguageService } from '../../core/i18n/language.service';
interface Policy{id:number;nameFa:string;nameEn:string;annual:number;carry:number;approval:boolean;active:boolean}
@Component({selector:'app-leave-policy-engine',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./leave-policy-engine.html'}) export class LeavePolicyEngine{
 policies:Policy[]=[{id:1,nameFa:'مرخصی استحقاقی استاندارد',nameEn:'Standard annual leave',annual:26,carry:9,approval:true,active:true}];draft:Policy|null=null;
 constructor(public language:LanguageService){}get fa(){return this.language.currentLanguage==='fa'}t(f:string,e:string){return this.fa?f:e} add(){this.draft={id:Date.now(),nameFa:'',nameEn:'',annual:26,carry:0,approval:true,active:true}} save(){if(!this.draft)return;this.policies.push({...this.draft});this.draft=null} remove(id:number){this.policies=this.policies.filter(x=>x.id!==id)}
}
