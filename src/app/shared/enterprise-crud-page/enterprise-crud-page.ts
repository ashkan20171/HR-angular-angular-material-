import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessControlService } from '../../core/auth/access-control.service';
import { LanguageService } from '../../core/i18n/language.service';
export interface BilingualText { fa:string; en:string }
export interface EnterprisePageConfig { title:BilingualText; subtitle:BilingualText; item:BilingualText; icon:string; kpisFa:string[][]; kpisEn:string[][]; rowsFa:string[][]; rowsEn:string[][]; permissions?:{create?:string;edit?:string;delete?:string;export?:string} }
@Component({selector:'app-enterprise-crud-page',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./enterprise-crud-page.html',styleUrl:'./enterprise-crud-page.css'})
export class EnterpriseCrudPage{
 @Input({required:true}) config!:EnterprisePageConfig; search=''; statusFilter='all'; sortOrder='name-asc'; page=1; pageSize=10; modal=false; detailsRow:string[]|null=null; attemptedSave=false; editingIndex:number|null=null; form={name:'',detail:'',status:''};
 constructor(public language:LanguageService, private access:AccessControlService){}
 can(action:'create'|'edit'|'delete'|'export'){const permission=this.config.permissions?.[action];return !permission || this.access.can(permission)}
 @HostListener('document:keydown.escape') onEscape(){this.modal=false;this.detailsRow=null}
 showDetails(row:string[]){this.detailsRow=row}
 get nameInvalid(){return !this.form.name.trim()||this.form.name.trim().length>120}
 get detailInvalid(){return this.form.detail.length>1000}
 get statusInvalid(){return this.form.status.length>80}
 get totalPages(){return Math.max(1,Math.ceil(this.rows.length/this.pageSize))}
 get pagedRows(){return this.rows.slice((Math.min(this.page,this.totalPages)-1)*this.pageSize,Math.min(this.page,this.totalPages)*this.pageSize)}
 setSearch(value:string){this.search=value;this.page=1}

 get isFa(){return this.language.currentLanguage==='fa'} get kpis(){return this.isFa?this.config.kpisFa:this.config.kpisEn} get baseRows(){return this.isFa?this.config.rowsFa:this.config.rowsEn}
 get statuses():string[]{return [...new Set(this.baseRows.map(r=>r[2]).filter(Boolean))]}
 get rows(){
  const q=this.search.trim().toLocaleLowerCase();
  const filtered=this.baseRows.filter(r=>(!q||r.join(' ').toLocaleLowerCase().includes(q))&&(this.statusFilter==='all'||r[2]===this.statusFilter));
  return [...filtered].sort((a,b)=>this.sortOrder==='name-desc'?b[0].localeCompare(a[0],this.isFa?'fa':'en'):a[0].localeCompare(b[0],this.isFa?'fa':'en'));
 }
 clearFilters(){this.search='';this.statusFilter='all';this.sortOrder='name-asc';this.page=1}
 get hasFilters(){return !!this.search||this.statusFilter!=='all'||this.sortOrder!=='name-asc'}
 t(fa:string,en:string){return this.isFa?fa:en}
 openNew(){if(!this.can('create'))return;this.attemptedSave=false;this.editingIndex=null;this.form={name:'',detail:'',status:this.t('فعال','Active')};this.modal=true}
 edit(row:string[]){if(!this.can('edit'))return;this.attemptedSave=false;this.editingIndex=this.baseRows.indexOf(row);this.form={name:row[0],detail:row[1],status:row[2]};this.modal=true}
 save(){if(!this.can(this.editingIndex===null?'create':'edit'))return;this.attemptedSave=true;if(!this.form.name.trim()||this.form.name.trim().length>120||this.form.detail.length>1000||this.form.status.length>80)return; const target=this.isFa?this.config.rowsFa:this.config.rowsEn; const value=[this.form.name.trim(),this.form.detail.trim(),this.form.status.trim()||this.t('فعال','Active')]; if(this.editingIndex===null)target.unshift(value);else if(this.editingIndex>=0)target[this.editingIndex]=value;this.modal=false;this.page=1}
 remove(row:string[]){if(!this.can('delete'))return;const target=this.isFa?this.config.rowsFa:this.config.rowsEn;const i=target.indexOf(row);if(i>=0&&confirm(this.t('این مورد حذف شود؟','Delete this item?'))){target.splice(i,1);this.page=Math.min(this.page,this.totalPages)}}
 exportCsv(){if(!this.can('export'))return;const rows=[[this.t('نام','Name'),this.t('توضیحات','Details'),this.t('وضعیت','Status')],...this.rows];const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ashkanhr-export.csv';a.click();URL.revokeObjectURL(a.href)}
}
