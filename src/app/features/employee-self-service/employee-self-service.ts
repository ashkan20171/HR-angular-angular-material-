import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
interface ServiceRequest {id:string;ownerId:string;type:string;subject:string;status:'submitted'}
@Component({selector:'app-employee-self-service',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./employee-self-service.html'})
export class EmployeeSelfService {
 private records=inject(PersonalRecordsService);
 rows:ServiceRequest[]=[];
 form={type:'document',subject:''};message='';
 constructor(public lang:LanguageService){this.reload()}
 get fa(){return this.lang.currentLanguage==='fa'}
 private reload(){const id=this.records.ownerId;this.rows=id?this.records.read<ServiceRequest>('self-service').filter(x=>x?.ownerId===id):[]}
 add(){const ownerId=this.records.ownerId,subject=this.form.subject.trim();if(!ownerId||!subject)return;
  const row:ServiceRequest={id:globalThis.crypto?.randomUUID?.()??String(Date.now()),ownerId,type:this.form.type,subject:subject.slice(0,200),status:'submitted'};
  if(this.records.write('self-service',[row,...this.rows])){this.form={type:'document',subject:''};this.reload();this.message=''}else this.message=this.fa?'ذخیره ناموفق بود.':'Save failed.';
 }
 remove(id:string){const row=this.rows.find(x=>x.id===id);if(!row||row.status!=='submitted')return;
  if(this.records.write('self-service',this.rows.filter(x=>x.id!==id)))this.reload();
 }
}
