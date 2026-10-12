import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from './notification.service';
import { LanguageService } from '../../core/i18n/language.service';
@Component({selector:'app-notifications',standalone:true,templateUrl:'./notifications.html',styleUrl:'./notifications.css',imports:[CommonModule,FormsModule]})
export class Notifications implements OnInit {
 notif=inject(NotificationService);
 lang=inject(LanguageService);
 title='';message='';error='';filter:'all'|'unread'|'important'='all';
 get fa(){return this.lang.currentLanguage==='fa'}
 t(f:string,e:string){return this.fa?f:e}
 ngOnInit(){this.notif.refresh()}
 get visible(){return this.notif.notifications().filter(n=>this.filter==='all'||(this.filter==='unread'?!n.read:n.important))}
 create(){if(this.notif.add(this.title,this.message)){this.title='';this.message='';this.error=''}else this.error=this.t('عنوان معتبر وارد کنید؛ حداکثر ۱۰۰ یادداشت مجاز است.','Enter a valid title; maximum 100 notes.')}
}
