import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';

type Session={device:string;location:string;last:string;current:boolean};
type EventItem={type:string;detailFa:string;detailEn:string;time:string;severity:'low'|'medium'|'high'};
@Component({selector:'app-security-center',standalone:true,imports:[CommonModule,LocaleDatePipe],templateUrl:'./security-center.html'})
export class SecurityCenter{
 private platformId=inject(PLATFORM_ID);
 sessions:Session[]=[{device:'Chrome · Windows 11',location:'Current device',last:new Date().toISOString(),current:true},{device:'Edge · Windows',location:'Office',last:new Date(Date.now()-86400000).toISOString(),current:false}];
 events:EventItem[]=[{type:'login',detailFa:'ورود موفق مدیر سیستم',detailEn:'Successful administrator sign-in',time:new Date().toISOString(),severity:'low'},{type:'permission',detailFa:'سطح دسترسی یک نقش تغییر کرد',detailEn:'A role permission was changed',time:new Date(Date.now()-7200000).toISOString(),severity:'medium'}];
 constructor(public lang:LanguageService){}
 get fa(){return this.lang.currentLanguage==='fa'}
 revoke(i:number){if(!this.sessions[i]?.current)this.sessions.splice(i,1)}
 revokeOthers(){this.sessions=this.sessions.filter(x=>x.current)}
 clearSecurityCache(){if(isPlatformBrowser(this.platformId)) sessionStorage.clear()}
}
