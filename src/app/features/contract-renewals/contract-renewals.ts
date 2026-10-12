import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import moment from 'moment-jalaali';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { AccessControlService } from '../../core/auth/access-control.service';
import { LanguageService } from '../../core/i18n/language.service';

interface ContractEmployee {
  id: string; firstName: string; lastName: string; employeeCode: string;
  department: string; jobTitle: string; status: 'active'|'leave'|'inactive';
  contractStart?: string; contractEnd?: string; employmentType?: string;
}
type ContractStatus = 'expired'|'soon'|'valid'|'open';
@Component({selector:'app-contract-renewals',standalone:true,imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./contract-renewals.html',styleUrl:'./contract-renewals.css'})
export class ContractRenewals implements OnInit {
  private readonly records = inject(PersonalRecordsService);
  private readonly access = inject(AccessControlService);
  readonly lang = inject(LanguageService);
  employees: ContractEmployee[] = [];
  query = '';
  filter: 'all'|ContractStatus = 'all';
  department = 'all';
  activeOnly = true;
  readonly horizon = 60;
  get fa(): boolean { return this.lang.currentLanguage === 'fa'; }
  t(fa: string,en: string): string { return this.fa ? fa : en; }
  ngOnInit(): void { this.refresh(); }
  refresh(): void {
    this.employees = this.records.read<ContractEmployee>('employee-directory-v1')
      .filter(e => !!e && typeof e.id === 'string' && typeof e.employeeCode === 'string');
  }
  private today(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  private future(): string {
    const d = new Date(); d.setDate(d.getDate()+this.horizon);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  status(e: ContractEmployee): ContractStatus {
    if (!e.contractEnd || !moment(e.contractEnd,'YYYY-MM-DD',true).isValid()) return 'open';
    if (e.contractEnd < this.today()) return 'expired';
    return e.contractEnd <= this.future() ? 'soon' : 'valid';
  }
  label(s: ContractStatus): string {
    const labels: Record<ContractStatus,[string,string]> = {
      expired:['منقضی‌شده','Expired'],soon:['رو به پایان','Ending soon'],
      valid:['معتبر','Valid'],open:['بدون تاریخ پایان','No end date']
    };
    return this.t(...labels[s]);
  }
  get departments(): string[] { return Array.from(new Set(this.employees.map(e=>e.department?.trim()).filter((v):v is string=>!!v))).sort(); }
  get scoped(): ContractEmployee[] { return this.employees.filter(e=>!this.activeOnly || e.status==='active'); }
  get counts(): Record<ContractStatus,number> {
    return this.scoped.reduce((a,e)=>{a[this.status(e)]++;return a;},{expired:0,soon:0,valid:0,open:0});
  }
  get visible(): ContractEmployee[] {
    const q=this.query.trim().toLocaleLowerCase();
    return this.scoped.filter(e=>(this.filter==='all'||this.status(e)===this.filter)
      &&(this.department==='all'||e.department===this.department)
      &&(!q||[e.firstName,e.lastName,e.employeeCode,e.department,e.jobTitle].join(' ').toLocaleLowerCase().includes(q)))
      .sort((a,b)=>(a.contractEnd||'9999-12-31').localeCompare(b.contractEnd||'9999-12-31'));
  }
  date(value?:string): string {
    if(!value)return '—';
    const d=moment(value,'YYYY-MM-DD',true);
    return d.isValid() ? d.format(this.fa?'jYYYY/jMM/jDD':'YYYY-MM-DD') : '—';
  }
  get canExport(): boolean { return this.access.can('employees.export') || this.access.can('reports.export'); }
  get canRenew(): boolean { return this.access.can('employees.edit') && this.access.can('employees.view'); }
  exportCsv(): void {
    if(!this.canExport)return;
    const lines=[['Employee code','First name','Last name','Department','Position','Start (ISO)','End (ISO)','Status'],
      ...this.visible.map(e=>[e.employeeCode,e.firstName,e.lastName,e.department,e.jobTitle,e.contractStart||'',e.contractEnd||'',this.status(e)])];
    const csv='\uFEFF'+lines.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='ashkanhr-contracts.csv';a.click();URL.revokeObjectURL(url);
  }
}
