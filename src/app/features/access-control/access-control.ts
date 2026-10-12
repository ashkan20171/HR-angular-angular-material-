import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessControlService, DataScope, EnterpriseRole, RolePolicy } from '../../core/auth/access-control.service';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-access-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-control.html',
  styleUrls: ['./access-control.css']
})
export class AccessControl {
  selected: EnterpriseRole = 'admin';
  search = '';
  showResetConfirmation = false;
  notice = '';
  readonly scopes: DataScope[] = ['own', 'team', 'department', 'all'];
  readonly groups = [
    {fa:'کارکنان', en:'Employees', items:['employees.view','employees.create','employees.edit','employees.delete','employees.export']},
    {fa:'حقوق و دستمزد', en:'Payroll', items:['payroll.view','payroll.manage','payroll.export']},
    {fa:'تأییدها', en:'Approvals', items:['approvals.view','approvals.manage','requests.approve','leave.approve','mission.approve','overtime.approve']},
    {fa:'مدیریت', en:'Administration', items:['analytics.view','analytics.export','audit.view','roles.view','roles.manage','settings.view','settings.manage','security.view','security.manage','delegation.view','delegation.manage','reports.view','reports.export']}
  ];
  constructor(public access: AccessControlService, public lang: LanguageService) {}
  get fa(): boolean { return this.lang.currentLanguage === 'fa'; }
  get roles(): RolePolicy[] { return this.access.policies(); }
  get policy(): RolePolicy { return this.access.policy(this.selected); }
  get isProtectedRole(): boolean { return this.selected === 'admin' || this.selected === 'super-admin'; }
  get visibleGroups() {
    const q = this.search.trim().toLocaleLowerCase();
    if (!q) return this.groups;
    return this.groups.map(g => ({
      ...g, items: g.items.filter(p => p.toLowerCase().includes(q) || g.fa.includes(q) || g.en.toLowerCase().includes(q))
    })).filter(g => g.items.length);
  }
  label(role: RolePolicy): string { return this.fa ? role.fa : role.en; }
  has(permission: string): boolean { return this.policy.permissions.includes(permission); }
  count(items: string[]): number { return items.filter(p => this.has(p)).length; }
  toggle(permission: string): void {
    if (this.isProtectedRole) return;
    this.access.toggle(this.selected, permission);
    this.notice = this.fa ? 'مجوز به‌روزرسانی شد' : 'Permission updated';
  }
  setGroup(items: string[], enabled: boolean): void {
    if (this.isProtectedRole) return;
    const current = this.access.policy(this.selected);
    const permissions = enabled
      ? Array.from(new Set([...current.permissions, ...items]))
      : current.permissions.filter(p => !items.includes(p));
    this.access.save(this.access.policies().map(p =>
      p.id === this.selected ? {...p, permissions} : p));
    this.notice = this.fa ? 'مجوزهای گروه ذخیره شد' : 'Group permissions saved';
  }
  scope(value: string): void {
    if (this.isProtectedRole || !this.scopes.includes(value as DataScope)) return;
    this.access.setScope(this.selected, value as DataScope);
    this.notice = this.fa ? 'محدوده داده ذخیره شد' : 'Data scope saved';
  }
  reset(): void {
    if (!this.showResetConfirmation) { this.showResetConfirmation = true; return; }
    this.access.reset();
    this.showResetConfirmation = false;
    this.notice = this.fa ? 'تنظیمات پیش‌فرض بازیابی شد' : 'Default policies restored';
  }
}
