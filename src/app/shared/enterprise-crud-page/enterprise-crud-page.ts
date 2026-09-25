import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';
export interface BilingualText { fa:string; en:string }
export interface EnterprisePageConfig { title:BilingualText; subtitle:BilingualText; item:BilingualText; icon:string; kpisFa:string[][]; kpisEn:string[][]; rowsFa:string[][]; rowsEn:string[][] }
@Component({selector:'app-enterprise-crud-page',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./enterprise-crud-page.html',styleUrl:'./enterprise-crud-page.css'})
export class EnterpriseCrudPage{
 @Input({required:true}) config!:EnterprisePageConfig; search=''; modal=false; editingIndex:number|null=null; form={name:'',detail:'',status:''};
 constructor(public language:LanguageService){}
 get isFa(){return this.language.currentLanguage==='fa'} get kpis(){return this.isFa?this.config.kpisFa:this.config.kpisEn} get baseRows(){return this.isFa?this.config.rowsFa:this.config.rowsEn}
 get rows(){const q=this.search.trim().toLowerCase();return !q?this.baseRows:this.baseRows.filter(r=>r.join(' ').toLowerCase().includes(q))}
 t(fa:string,en:string){return this.isFa?fa:en}
 openNew(){this.editingIndex=null;this.form={name:'',detail:'',status:this.t('فعال','Active')};this.modal=true}
 edit(row:string[]){this.editingIndex=this.baseRows.indexOf(row);this.form={name:row[0],detail:row[1],status:row[2]};this.modal=true}
 save(){if(!this.form.name.trim())return; const target=this.isFa?this.config.rowsFa:this.config.rowsEn; const value=[this.form.name.trim(),this.form.detail.trim(),this.form.status.trim()||this.t('فعال','Active')]; if(this.editingIndex===null)target.unshift(value);else target[this.editingIndex]=value;this.modal=false}
 remove(row:string[]){const target=this.isFa?this.config.rowsFa:this.config.rowsEn;const i=target.indexOf(row);if(i>=0&&confirm(this.t('این مورد حذف شود؟','Delete this item?')))target.splice(i,1)}
 exportCsv(){const rows=[['Name','Detail','Status'],...this.baseRows];const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ashkanhr-export.csv';a.click();URL.revokeObjectURL(a.href)}
}
