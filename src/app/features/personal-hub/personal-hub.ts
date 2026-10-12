import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { LanguageService } from '../../core/i18n/language.service';
interface Shortcut { route:string; fa:string; en:string; icon:string; }
interface Task { ownerId:string; done:boolean; }
@Component({selector:'app-personal-hub',standalone:true,imports:[CommonModule,RouterLink,FormsModule],templateUrl:'./personal-hub.html',styleUrl:'./personal-hub.css'})
export class PersonalHub implements OnInit {
 private records=inject(PersonalRecordsService);
 language=inject(LanguageService);
 readonly shortcuts:Shortcut[]=[
  {route:'my-workspace',fa:'کارهای شخصی',en:'My tasks',icon:'checklist'},
  {route:'profile',fa:'پروفایل من',en:'My profile',icon:'account_circle'},
  {route:'leave',fa:'مرخصی من',en:'My leave',icon:'event_available'},
  {route:'mission',fa:'مأموریت من',en:'My missions',icon:'flight_takeoff'},
  {route:'attendance',fa:'حضور و غیاب',en:'Attendance',icon:'schedule'},
  {route:'document-vault',fa:'مدارک شخصی',en:'My documents',icon:'folder_open'}
 ];
 selected:string[]=[]; openTasks=0; completedTasks=0; documentCount=0; error='';
 get fa(){return this.language.currentLanguage==='fa'}
 t(fa:string,en:string){return this.fa?fa:en}
 ngOnInit(){this.refresh()}
 refresh(){
  const owner=this.records.ownerId;
  if(!owner){this.selected=[];this.openTasks=0;this.completedTasks=0;this.documentCount=0;return}
  const settings=this.records.read<{routes?:string[]}>('personal-hub-settings')[0];
  const allowed=new Set(this.shortcuts.map(x=>x.route));
  this.selected=Array.isArray(settings?.routes)?settings.routes.filter(x=>allowed.has(x)):['my-workspace','profile','leave','mission'];
  const tasks=this.records.read<Task>('my-workspace-tasks').filter(x=>x?.ownerId===owner);
  this.openTasks=tasks.filter(x=>!x.done).length;
  this.completedTasks=tasks.filter(x=>x.done).length;
  this.documentCount=this.records.read<{ownerId:string}>('document-metadata').filter(x=>x?.ownerId===owner).length;
 }
 get pinned(){return this.shortcuts.filter(x=>this.selected.includes(x.route))}
 toggle(route:string){
  const next=this.selected.includes(route)?this.selected.filter(x=>x!==route):[...this.selected,route];
  if(!this.records.write('personal-hub-settings',[{routes:next}])){
   this.error=this.t('ذخیره تنظیمات ناموفق بود.','Could not save preferences.');return;
  }
  this.selected=next;this.error='';
 }
}
