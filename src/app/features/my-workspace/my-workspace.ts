import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { LanguageService } from '../../core/i18n/language.service';

type Priority = 'low'|'normal'|'high';
interface Task { id:string; ownerId:string; title:string; done:boolean; priority:Priority; createdAt:string; }
@Component({selector:'app-my-workspace',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./my-workspace.html',styleUrl:'./my-workspace.css'})
export class MyWorkspace implements OnInit {
 private records=inject(PersonalRecordsService);
 lang=inject(LanguageService);
 tasks:Task[]=[];title='';priority:Priority='normal';filter:'all'|'open'|'done'='all';error='';
 get fa(){return this.lang.currentLanguage==='fa'}
 t(fa:string,en:string){return this.fa?fa:en}
 ngOnInit(){this.load()}
 private load(){const id=this.records.ownerId;this.tasks=id?this.records.read<Task>('my-workspace-tasks').filter(x=>x&&x.ownerId===id&&typeof x.title==='string').slice(0,200):[]}
 get visible(){return this.tasks.filter(t=>this.filter==='all'||(this.filter==='done'?t.done:!t.done))}
 get completed(){return this.tasks.filter(t=>t.done).length}
 private persist(next:Task[]){if(!this.records.write('my-workspace-tasks',next)){this.error=this.t('ذخیره‌سازی انجام نشد.','Could not save.');return false}this.tasks=next;this.error='';return true}
 add(){const ownerId=this.records.ownerId;const title=this.title.trim();if(!ownerId||!title||title.length>120||this.tasks.length>=200){this.error=this.t('عنوان معتبر وارد کنید (حداکثر ۱۲۰ حرف و ۲۰۰ کار).','Enter a valid title (max 120 characters and 200 tasks).');return}
 const id=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.floor(Math.random()*100000)}`;
 if(this.persist([{id,ownerId,title,done:false,priority:this.priority,createdAt:new Date().toISOString()},...this.tasks]))this.title='';
 }
 toggle(id:string){this.persist(this.tasks.map(x=>x.id===id?{...x,done:!x.done}:x))}
 remove(id:string){this.persist(this.tasks.filter(x=>x.id!==id))}
}
