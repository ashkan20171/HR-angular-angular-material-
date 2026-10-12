import { Injectable, inject } from '@angular/core';
import { PersonalRecordsService } from './personal-records.service';

/** Self-scoped employment profile draft. Never grants permissions or verifies reporting lines. */
export interface EmploymentProfile {
  ownerId: string;
  employeeCode: string;
  department: string;
  team: string;
  jobTitle: string;
  managerName: string;
  startDate: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  verification: 'unverified';
}
@Injectable({ providedIn: 'root' })
export class EmploymentProfileService {
  private records = inject(PersonalRecordsService);
  get current(): EmploymentProfile | null {
    const ownerId = this.records.ownerId;
    if (!ownerId) return null;
    const row = this.records.read<EmploymentProfile>('employment-profile').find(x => x?.ownerId === ownerId);
    return row ? { ...row, verification: 'unverified' } : null;
  }
  private isValidDate(value:string):boolean {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
    const [year,month,day]=value.split('-').map(Number);
    const date=new Date(year,month-1,day);
    return date.getFullYear()===year && date.getMonth()===month-1 && date.getDate()===day;
  }
  save(input: Omit<EmploymentProfile, 'ownerId' | 'verification'>): boolean {
    const ownerId = this.records.ownerId;
    if (!ownerId) return false;
    const clean = (s: string) => String(s ?? '').trim().slice(0, 120);
    const profile: EmploymentProfile = {
      ownerId, employeeCode: clean(input.employeeCode), department: clean(input.department),
      team: clean(input.team), jobTitle: clean(input.jobTitle), managerName: clean(input.managerName),
      startDate: this.isValidDate(input.startDate) ? input.startDate : '',
      employmentType: ['full-time','part-time','contract','intern'].includes(input.employmentType)
        ? input.employmentType : 'full-time', verification: 'unverified'
    };
    return this.records.write('employment-profile', [profile]);
  }
}
