import { CommonModule } from '@angular/common';import { Component } from '@angular/core';import { FormsModule } from '@angular/forms';import { LanguageService } from '../../core/i18n/language.service';import { LocaleDatePipe } from '../../shared/locale-date.pipe';
interface DelegationItem{id:number;from:string;to:string;scope:string;start:string;end:string;active:boolean}
@Component({selector:'app-delegation',standalone:true,imports:[CommonModule,FormsModule,LocaleDatePipe],templateUrl:'./delegation.html'}) export class Delegation{
 items:DelegationItem[]=[{id:1,from:'HR Manager',to:'Department Manager',scope:'leave.approve',start:'2026-09-24',end:'2026-10-01',active:true}];
 form={to:'',scope:'leave.approve',start:'',end:''}; constructor(public lang:LanguageService){} get fa(){return this.lang.currentLanguage==='fa'}
 add(){if(!this.form.to||!this.form.start||!this.form.end)return;this.items.unshift({id:Date.now(),from:'Current user',to:this.form.to,scope:this.form.scope,start:this.form.start,end:this.form.end,active:true});this.form={to:'',scope:'leave.approve',start:'',end:''}}
 toggle(x:DelegationItem){x.active=!x.active} remove(id:number){this.items=this.items.filter(x=>x.id!==id)}
}
