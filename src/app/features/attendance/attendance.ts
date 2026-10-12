import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { LanguageService } from '../../core/i18n/language.service';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';
interface AttendanceRecord { ownerId:string; date:string; in:string|null; out:string|null; workHours:number; overtime:number; delay:number; }
@Component({selector:'app-attendance',standalone:true,templateUrl:'./attendance.html',styleUrl:'./attendance.css',imports:[CommonModule,LocaleDatePipe]})
export class Attendance implements OnInit {
 private records=inject(PersonalRecordsService); language=inject(LanguageService);
 get fa(){return this.language.currentLanguage==='fa';} t(f:string,e:string){return this.fa?f:e;}
 get today(){return new Date().toISOString().slice(0,10);}
 punchInTime:string|null=null; punchOutTime:string|null=null;
 workedHoursToday=0;overtimeToday=0;delayToday=0; monthRecords:AttendanceRecord[]=[];error='';
 ngOnInit(){this.reload();}
 private reload(){const owner=this.records.ownerId;this.monthRecords=owner?this.records.read<AttendanceRecord>('attendance').filter(r=>r.ownerId===owner):[];
 const r=this.monthRecords.find(x=>x.date===this.today);this.punchInTime=r?.in??null;this.punchOutTime=r?.out??null;this.workedHoursToday=r?.workHours??0;this.overtimeToday=r?.overtime??0;this.delayToday=r?.delay??0;}
 private time(){return new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});}
 timeToMinutes(t:string){const [h,m]=t.split(':').map(Number);return h*60+m;}
 punchIn(){this.error='';const owner=this.records.ownerId;if(!owner){this.error=this.t('ابتدا وارد حساب شوید.','Please sign in.');return;}
 if(this.punchInTime){this.error=this.t('ورود امروز قبلاً ثبت شده است.','Already clocked in today.');return;}
 const time=this.time();const item:AttendanceRecord={ownerId:owner,date:this.today,in:time,out:null,workHours:0,overtime:0,delay:Math.max(0,(this.timeToMinutes(time)-540)/60)};
 if(!this.records.write('attendance',[item,...this.monthRecords.filter(x=>x.date!==this.today)])){this.error=this.t('ذخیره ناموفق بود.','Could not save.');return;}this.reload();}
 punchOut(){this.error='';if(!this.punchInTime||this.punchOutTime){this.error=this.t('ثبت خروج ممکن نیست.','Cannot clock out.');return;}
 const end=this.time(),minutes=this.timeToMinutes(end)-this.timeToMinutes(this.punchInTime);
 if(minutes<0){this.error=this.t('شیفت شب در این نسخه پشتیبانی نمی‌شود.','Overnight shifts are not supported in this demo.');return;}
 const updated=this.monthRecords.map(x=>x.date===this.today?{...x,out:end,workHours:+(minutes/60).toFixed(2),overtime:+(Math.max(0,minutes-480)/60).toFixed(2)}:x);
 if(!this.records.write('attendance',updated)){this.error=this.t('ذخیره ناموفق بود.','Could not save.');return;}this.reload();}
}
