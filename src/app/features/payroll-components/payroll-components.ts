import { CommonModule } from '@angular/common';import { Component } from '@angular/core';import { FormsModule } from '@angular/forms';import { LanguageService } from '../../core/i18n/language.service';
type Kind='earning'|'deduction';interface Item{id:number;nameFa:string;nameEn:string;kind:Kind;formula:string;taxable:boolean;active:boolean}
@Component({selector:'app-payroll-components',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./payroll-components.html'}) export class PayrollComponents{
 items:Item[]=[{id:1,nameFa:'حق مسکن',nameEn:'Housing allowance',kind:'earning',formula:'fixed:9000000',taxable:true,active:true},{id:2,nameFa:'بیمه سهم کارمند',nameEn:'Employee insurance',kind:'deduction',formula:'base*0.07',taxable:false,active:true}];draft:Item|null=null;
 constructor(public language:LanguageService){}get fa(){return this.language.currentLanguage==='fa'}t(f:string,e:string){return this.fa?f:e} add(){this.draft={id:Date.now(),nameFa:'',nameEn:'',kind:'earning',formula:'',taxable:false,active:true}} save(){if(!this.draft)return;this.items.push({...this.draft});this.draft=null} remove(id:number){this.items=this.items.filter(x=>x.id!==id)}
}
