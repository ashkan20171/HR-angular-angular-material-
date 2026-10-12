import { Component,inject,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';import { FormsModule } from '@angular/forms';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { LanguageService } from '../../core/i18n/language.service';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';
import { LocaleDateInput } from '../../shared/locale-date-input/locale-date-input';
interface OvertimeRecord {id:string;ownerId:string;date:string;start:string;end:string;hours:number;reason:string;status:'pending'|'accepted'|'rejected';}
@Component({selector:'app-overtime',standalone:true,templateUrl:'./overtime.html',styleUrl:'./overtime.css',imports:[CommonModule,FormsModule,LocaleDatePipe,LocaleDateInput]})
export class Overtime implements OnInit {
 private records=inject(PersonalRecordsService);language=inject(LanguageService);
 get fa(){return this.language.currentLanguage==='fa';}t(f:string,e:string){return this.fa?f:e;}
 showModal=false;error='';overtimeList:OvertimeRecord[]=[];form={date:'',start:'',end:'',reason:''};
 ngOnInit(){this.reload();}private reload(){const id=this.records.ownerId;this.overtimeList=id?this.records.read<OvertimeRecord>('overtime').filter(x=>x.ownerId===id):[];}
 getTotalThisMonth(){const month=new Date().toISOString().slice(0,7);return +this.overtimeList.filter(x=>x.date.startsWith(month)).reduce((s,x)=>s+x.hours,0).toFixed(2);}
 openNew(){this.error='';this.form={date:'',start:'',end:'',reason:''};this.showModal=true;}closeModal(){this.showModal=false;}
 private minutes(t:string){if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(t))return null;const [h,m]=t.split(':').map(Number);return h*60+m;}
 submit(){const id=this.records.ownerId;const start=this.minutes(this.form.start),end=this.minutes(this.form.end);
 const date=this.form.date;const parsed=/^\d{4}-\d{2}-\d{2}$/.test(date)?new Date(date+'T12:00:00Z'):null;
 if(!id||start===null||end===null||end<=start||!parsed||Number.isNaN(parsed.getTime())||parsed.toISOString().slice(0,10)!==date){this.error=this.t('تاریخ و ساعت معتبر وارد کنید؛ پایان باید بعد از شروع باشد.','Enter valid date and times; end must be after start.');return;}
 const item:OvertimeRecord={id:globalThis.crypto?.randomUUID?.()??String(Date.now()),ownerId:id,date,start:this.form.start,end:this.form.end,hours:+((end-start)/60).toFixed(2),reason:this.form.reason.trim(),status:'pending'};
 if(!this.records.write('overtime',[item,...this.overtimeList])){this.error=this.t('ذخیره ناموفق بود.','Could not save.');return;}this.reload();this.closeModal();}
}
