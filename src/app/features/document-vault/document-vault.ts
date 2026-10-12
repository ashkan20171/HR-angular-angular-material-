import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';
import { LocaleDateInput } from '../../shared/locale-date-input/locale-date-input';

interface DocumentEntry {
  id: string; ownerId: string; titleFa: string; titleEn: string;
  category: 'contract'|'identity'|'certificate'|'other';
  expires: string; confidential: boolean; updatedAt: string;
}
interface AuditEntry { id: string; ownerId: string; action: 'created'|'deleted'; title: string; at: string; }
@Component({
 selector:'app-document-vault', standalone:true,
 imports:[CommonModule, FormsModule, LocaleDatePipe, LocaleDateInput],
 templateUrl:'./document-vault.html', styleUrl:'./document-vault.css'
})
export class DocumentVault implements OnInit {
 private records=inject(PersonalRecordsService);
 language=inject(LanguageService);
 docs:DocumentEntry[]=[];
 history:AuditEntry[]=[];
 draft:DocumentEntry|null=null;
 query=''; error=''; notice='';
 get fa(){return this.language.currentLanguage==='fa'}
 t(f:string,e:string){return this.fa?f:e}
 ngOnInit(){this.reload()}
 private reload(){
  const owner=this.records.ownerId;
  this.docs=owner?this.records.read<DocumentEntry>('document-metadata').filter(x=>x?.ownerId===owner):[];
  this.history=owner?this.records.read<AuditEntry>('document-history').filter(x=>x?.ownerId===owner).slice(0,50):[];
 }
 get confidentialCount(){return this.docs.filter(x=>x.confidential).length}
 get filtered(){const q=this.query.trim().toLocaleLowerCase();return this.docs.filter(x=>!q||`${x.titleFa} ${x.titleEn} ${x.category}`.toLocaleLowerCase().includes(q))}
 add(){
  const ownerId=this.records.ownerId;
  if(!ownerId){this.error=this.t('ابتدا وارد حساب شوید.','Sign in first.');return;}
  this.error='';this.notice='';
  this.draft={id:'',ownerId,titleFa:'',titleEn:'',category:'other',expires:'',confidential:true,updatedAt:''};
 }
 private validDate(value:string){
  if(!value)return true;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const [y,m,d]=value.split('-').map(Number);
  const date=new Date(y,m-1,d);
  return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d;
 }
 private commit(docs:DocumentEntry[],history:AuditEntry[]):boolean {
  if(!this.records.write('document-metadata',docs))return false;
  if(!this.records.write('document-history',history.slice(0,50))){
   this.records.write('document-metadata',this.docs);
   return false;
  }
  this.docs=docs;this.history=history.slice(0,50);return true;
 }
 save(){
  const draft=this.draft,owner=this.records.ownerId;
  if(!draft||!owner||draft.ownerId!==owner)return;
  if(!(draft.titleFa.trim()||draft.titleEn.trim())||draft.titleFa.length>120||draft.titleEn.length>120||!this.validDate(draft.expires)){
   this.error=this.t('عنوان یا تاریخ معتبر وارد کنید.','Enter a valid title and expiry date.');return;
  }
  const now=new Date().toISOString();
  const id=globalThis.crypto?.randomUUID?.()??String(Date.now());
  const entry={...draft,id,titleFa:draft.titleFa.trim(),titleEn:draft.titleEn.trim(),updatedAt:now};
  const log:AuditEntry={id,ownerId:owner,action:'created',title:entry.titleFa||entry.titleEn,at:now};
  if(!this.commit([entry,...this.docs],[log,...this.history])){
   this.error=this.t('ذخیره ناموفق بود.','Could not save.');return;
  }
  this.draft=null;this.error='';this.notice=this.t('پیش‌نویس سند ثبت شد.','Document draft saved.');
 }
 remove(id:string){
  const doc=this.docs.find(x=>x.id===id&&x.ownerId===this.records.ownerId);
  if(!doc)return;
  if(!globalThis.confirm?.(this.t('این مورد حذف شود؟','Delete this item?')))return;
  const log:AuditEntry={id,ownerId:doc.ownerId,action:'deleted',title:doc.titleFa||doc.titleEn,at:new Date().toISOString()};
  if(!this.commit(this.docs.filter(x=>x.id!==id),[log,...this.history])){
   this.error=this.t('حذف ناموفق بود.','Could not delete.');return;
  }
  this.notice=this.t('مورد حذف شد.','Item deleted.');
 }
}
