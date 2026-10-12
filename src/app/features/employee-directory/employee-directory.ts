import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment-jalaali';
import { AccessControlService } from '../../core/auth/access-control.service';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { LanguageService } from '../../core/i18n/language.service';

interface EmployeeHistoryEntry { id:string; employeeId:string; employeeCode:string; at:string; action:'created'|'updated'|'deleted'; before:EmployeeRecord|null; after:EmployeeRecord|null; }
interface EmployeeRecord {
  id: string; firstName: string; lastName: string; employeeCode: string;
  email: string; phone: string; department: string; jobTitle: string;
  hireDate: string; status: 'active'|'leave'|'inactive'; notes: string;
  employmentType?: 'full-time'|'part-time'|'contract'|'intern'; contractStart?: string; contractEnd?: string; manager?: string; location?: string;
}
@Component({selector:'app-employee-directory',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./employee-directory.html',styleUrl:'./employee-directory.css'})
export class EmployeeDirectory implements OnInit {
  private readonly access = inject(AccessControlService);
  private readonly records = inject(PersonalRecordsService);
  readonly language = inject(LanguageService);
  employees: EmployeeRecord[] = [];
  search = ''; filter: 'all'|'active'|'leave'|'inactive' = 'all';
  modal = false; attempted = false; editingId: string|null = null;
  selected: EmployeeRecord|null = null;
  message = '';
  jalaliHireDate = '';
  dateError = false;
  jalaliContractStart = ''; jalaliContractEnd = '';
  contractStartError = false; contractEndError = false;
  private normalizeDigits(value: string): string { return value.replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 1776)).replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 1632)); }
  displayHireDate(iso: string): string { if (!iso) return '—'; const parsed = moment(iso, 'YYYY-MM-DD', true); return !parsed.isValid() ? '—' : this.fa ? parsed.format('jYYYY/jMM/jDD') : parsed.format('YYYY-MM-DD'); }
  onJalaliDateChange(value: string): void {
    this.jalaliHireDate = value;
    if (!value.trim()) { this.form.hireDate = ''; this.dateError = false; return; }
    const normalized = this.normalizeDigits(value.trim()).replace(/-/g, '/');
    const parsed = moment(normalized, 'jYYYY/jMM/jDD', true);
    this.dateError = !parsed.isValid();
    this.form.hireDate = this.dateError ? '' : parsed.format('YYYY-MM-DD');
  }
  private syncJalaliDate(): void { this.jalaliHireDate = this.form.hireDate ? this.displayJalali(this.form.hireDate) : ''; this.dateError = false; }
  private displayJalali(iso: string): string { const parsed = moment(iso, 'YYYY-MM-DD', true); return parsed.isValid() ? parsed.format('jYYYY/jMM/jDD') : ''; }

  onJalaliContractChange(field: 'contractStart'|'contractEnd', value: string): void {
    if (field === 'contractStart') this.jalaliContractStart = value;
    else this.jalaliContractEnd = value;
    const normalized = this.normalizeDigits(value.trim()).replace(/-/g, '/');
    const parsed = moment(normalized, 'jYYYY/jMM/jDD', true);
    const error = !!value.trim() && !parsed.isValid();
    if (field === 'contractStart') this.contractStartError = error;
    else this.contractEndError = error;
    this.form[field] = !value.trim() || error ? '' : parsed.format('YYYY-MM-DD');
  }
  private syncContractDates(): void {
    this.jalaliContractStart = this.form.contractStart ? this.displayJalali(this.form.contractStart) : '';
    this.jalaliContractEnd = this.form.contractEnd ? this.displayJalali(this.form.contractEnd) : '';
    this.contractStartError = false; this.contractEndError = false;
  }
  get expiredContracts(): number {
    const today = this.todayIso();
    return this.employees.filter(e => e.status === 'active' && !!e.contractEnd && e.contractEnd < today).length;
  }
  private todayIso(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  contractStatus(e: EmployeeRecord): 'expired'|'soon'|'ok'|'none' {
    if (!e.contractEnd) return 'none';
    const today = this.todayIso();
    if (e.contractEnd < today) return 'expired';
    const limit = new Date(); limit.setDate(limit.getDate() + 60);
    const upper = `${limit.getFullYear()}-${String(limit.getMonth()+1).padStart(2,'0')}-${String(limit.getDate()).padStart(2,'0')}`;
    return e.contractEnd <= upper ? 'soon' : 'ok';
  }
  contractLabel(e: EmployeeRecord): string {
    const status = this.contractStatus(e);
    if (status === 'expired') return this.t('منقضی‌شده','Expired');
    if (status === 'soon') return this.t('رو به پایان','Ending soon');
    if (status === 'ok') return this.t('معتبر','Valid');
    return this.t('بدون تاریخ پایان','No end date');
  }
  renewalId: string|null = null;
  form: EmployeeRecord = this.empty();
  get fa(){return this.language.currentLanguage==='fa'}
  t(fa:string,en:string){return this.fa?fa:en}
  can(action:'create'|'edit'|'delete'|'export'){return this.access.can('employees.'+action)}
  ngOnInit(){this.employees=this.records.read<EmployeeRecord>('employee-directory-v1').filter(e=>e&&typeof e.id==='string'&&typeof e.employeeCode==='string')}
  private empty():EmployeeRecord{return {id:'',firstName:'',lastName:'',employeeCode:'',email:'',phone:'',department:'',jobTitle:'',hireDate:'',status:'active',notes:'',employmentType:'full-time',contractStart:'',contractEnd:'',manager:'',location:''}}
  get departments(){return new Set(this.employees.map(e=>e.department.trim()).filter(Boolean)).size}
  get contractsEndingSoon(){const today=this.todayIso();const limit=new Date();limit.setDate(limit.getDate()+60);const end=limit.toISOString().slice(0,10);return this.employees.filter(e=>e.contractEnd && e.contractEnd>=today && e.contractEnd<=end).length}
  get activeCount(){return this.employees.filter(e=>e.status==='active').length}
  get visible(){const q=this.search.trim().toLocaleLowerCase();return this.employees.filter(e=>(this.filter==='all'||e.status===this.filter)&&(!q||[e.firstName,e.lastName,e.employeeCode,e.email,e.department,e.jobTitle,e.manager??'',e.location??''].join(' ').toLocaleLowerCase().includes(q)))}
  get invalid(){const e=this.form;return !e.firstName.trim()||!e.lastName.trim()||!e.employeeCode.trim()||e.firstName.length>80||e.lastName.length>80||e.employeeCode.length>40||e.department.length>100||e.jobTitle.length>100||e.notes.length>1000||(e.manager??'').length>100||(e.location??'').length>100||!!e.contractStart&&!moment(e.contractStart,'YYYY-MM-DD',true).isValid()||!!e.contractEnd&&!moment(e.contractEnd,'YYYY-MM-DD',true).isValid()||!!e.contractStart&&!!e.contractEnd&&e.contractEnd<e.contractStart||!!e.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)||!!e.phone&&!/^[+\d\s()\-]{7,25}$/.test(e.phone)||this.dateError||this.contractStartError||this.contractEndError||!!e.hireDate&&!moment(e.hireDate,'YYYY-MM-DD',true).isValid()||this.employees.some(x=>x.employeeCode.trim().toLowerCase()===e.employeeCode.trim().toLowerCase()&&x.id!==this.editingId)}
  newEmployee(){if(!this.can('create'))return;this.renewalId=null;this.form=this.empty();this.syncJalaliDate();this.syncContractDates();this.editingId=null;this.attempted=false;this.modal=true}
  edit(e:EmployeeRecord){if(!this.can('edit'))return;this.renewalId=null;this.form={...this.empty(),...e};this.syncJalaliDate();this.syncContractDates();this.editingId=e.id;this.selected=null;this.attempted=false;this.modal=true}
  renew(e:EmployeeRecord){
    if(!this.can('edit'))return;
    this.edit(e);
    this.renewalId=e.id;
    this.form.contractStart=e.contractEnd || this.todayIso();
    this.form.contractEnd='';
    this.syncContractDates();
  }
  view(e:EmployeeRecord){this.selected=e}
  @HostListener('document:keydown.escape') onEscape(){if(this.modal||this.selected)this.close()}
  close(){this.modal=false;this.selected=null}
  save(){if(!this.can(this.editingId?'edit':'create'))return;this.attempted=true;if(this.invalid)return;
    const value={...this.form,firstName:this.form.firstName.trim(),lastName:this.form.lastName.trim(),employeeCode:this.form.employeeCode.trim(),email:this.form.email.trim(),manager:(this.form.manager??'').trim(),location:(this.form.location??'').trim()};
    const old=this.employees;const before=this.editingId?old.find(x=>x.id===this.editingId)??null:null;
    if(this.editingId){this.employees=old.map(x=>x.id===this.editingId?value:x)}
    else{value.id=globalThis.crypto?.randomUUID?.()??('emp-'+Date.now()+'-'+Math.random().toString(36).slice(2));this.employees=[value,...old]}
    if(!this.persist()){this.employees=old;this.message=this.t('ذخیره در مرورگر ناموفق بود','Could not save to browser storage');return;}
    const tracked=this.appendHistory(before?'updated':'created',before,value);
    this.renewalId=null;this.close();this.message=tracked?this.t('اطلاعات و تاریخچه ذخیره شد','Employee and history saved'):this.t('پرونده ذخیره شد، اما ثبت تاریخچه ناموفق بود','Employee saved, but history could not be recorded');
  }
  remove(e:EmployeeRecord){if(!this.can('delete')||!confirm(this.t('پرونده این کارمند حذف شود؟','Delete this employee record?')))return;const old=this.employees;this.employees=old.filter(x=>x.id!==e.id);if(!this.persist()){this.employees=old;this.message=this.t('حذف ذخیره نشد','Delete was not saved')}else{const tracked=this.appendHistory('deleted',e,null);this.close();this.message=tracked?this.t('حذف و تاریخچه ثبت شد','Deletion recorded'):this.t('حذف شد، اما ثبت تاریخچه ناموفق بود','Deleted, but history could not be recorded')}}
  private appendHistory(action:EmployeeHistoryEntry['action'],before:EmployeeRecord|null,after:EmployeeRecord|null):boolean {
    const history=this.records.read<EmployeeHistoryEntry>('employee-history-v1');
    const entry:EmployeeHistoryEntry={id:globalThis.crypto?.randomUUID?.()??('history-'+Date.now()),employeeId:(after??before)!.id,employeeCode:(after??before)!.employeeCode,at:new Date().toISOString(),action,before:before?{...before}:null,after:after?{...after}:null};
    return this.records.write('employee-history-v1',[entry,...history].slice(0,1000));
  }
  private persist(){return this.records.write('employee-directory-v1',this.employees)}
  exportCsv(){if(!this.can('export'))return;const rows=[[this.t('کد پرسنلی','Employee code'),this.t('نام','First name'),this.t('نام خانوادگی','Last name'),this.t('ایمیل','Email'),this.t('واحد','Department'),this.t('سمت','Job title')],...this.visible.map(e=>[e.employeeCode,e.firstName,e.lastName,e.email,e.department,e.jobTitle])];const csv='\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ashkanhr-employees.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),0)}
}
