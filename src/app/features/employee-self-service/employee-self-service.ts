import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';
interface ServiceRequest{id:number;type:string;subject:string;status:'draft'|'submitted'|'approved'}
@Component({selector:'app-employee-self-service',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./employee-self-service.html'})
export class EmployeeSelfService{rows:ServiceRequest[]=[{id:1,type:'document',subject:'Employment verification',status:'approved'}];form={type:'document',subject:''};constructor(public lang:LanguageService){}get fa(){return this.lang.currentLanguage==='fa'}add(){if(!this.form.subject.trim())return;this.rows.unshift({id:Date.now(),...this.form,status:'submitted'});this.form={type:'document',subject:''}}remove(id:number){this.rows=this.rows.filter(x=>x.id!==id)}}