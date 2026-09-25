import { CommonModule, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Component, HostListener } from '@angular/core';
import { CommandPalette } from '../shared/command-palette/command-palette';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { LanguageService } from '../core/i18n/language.service';
import { ThemeService } from '../core/services/theme.service';
import { NotificationService } from '../features/notifications/notification.service';
import { AccessControlService } from '../core/auth/access-control.service';

type NavItem = { titleFa: string; titleEn: string; icon: string; link: string; permission?: string; roles?: string[] };

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
  imports: [CommonModule, RouterModule, CommandPalette]
})
export class DashboardLayout {
  private platformId = inject(PLATFORM_ID);
  sidebarCollapsed = false;
  mobileOpen = false;
  searchOpen = false;
  userName = isPlatformBrowser(this.platformId) ? (localStorage.getItem('userName') || 'کاربر') : 'کاربر';
  userRole = isPlatformBrowser(this.platformId) ? (localStorage.getItem('role') || 'employee') : 'employee';

  menu: NavItem[] = [
    { titleFa: 'داشبورد', titleEn: 'Dashboard', icon: 'space_dashboard', link: 'dashboard', permission: 'dashboard.view' },
    { titleFa: 'داشبورد مدیران', titleEn: 'Executive', icon: 'monitoring', link: 'executive', roles: ['admin', 'manager', 'hr'] },
    { titleFa: 'کارکنان', titleEn: 'Employees', icon: 'groups', link: 'users', roles: ['admin', 'manager', 'hr'] },
    { titleFa: 'حضور و غیاب', titleEn: 'Attendance', icon: 'schedule', link: 'attendance', permission: 'attendance.view' },
    { titleFa: 'درخواست‌ها', titleEn: 'Requests', icon: 'assignment', link: 'requests', permission: 'requests.view' },
    { titleFa: 'مرخصی', titleEn: 'Leave', icon: 'event_available', link: 'leave' },
    { titleFa: 'ماموریت', titleEn: 'Missions', icon: 'flight_takeoff', link: 'mission' },
    { titleFa: 'اضافه‌کاری', titleEn: 'Overtime', icon: 'more_time', link: 'overtime' },
    { titleFa: 'حقوق و دستمزد', titleEn: 'Payroll', icon: 'payments', link: 'payroll', roles: ['admin', 'accounting', 'hr'] },
    { titleFa: 'فیش حقوقی من', titleEn: 'My payslip', icon: 'receipt_long', link: 'salary-slip' },
    { titleFa: 'ارزیابی عملکرد', titleEn: 'Performance', icon: 'insights', link: 'performance', permission: 'performance.view' },
    { titleFa: 'استخدام', titleEn: 'Recruitment', icon: 'person_search', link: 'recruitment', roles: ['admin', 'hr'] },
    { titleFa: 'پیام‌ها', titleEn: 'Messages', icon: 'mail', link: 'messages' },
    { titleFa: 'دایرکتوری کارکنان', titleEn: 'Directory', icon: 'badge', link: 'directory' },
    { titleFa: 'ساختار سازمانی', titleEn: 'Organization', icon: 'account_tree', link: 'organization', roles: ['admin', 'manager', 'hr'] },
    { titleFa: 'ورود و خروج کارکنان', titleEn: 'Onboarding', icon: 'person_add', link: 'onboarding', roles: ['admin', 'manager', 'hr'] },
    { titleFa: 'اسناد و قراردادها', titleEn: 'Documents', icon: 'folder_open', link: 'documents', roles: ['admin', 'hr'] },
    { titleFa: 'دارایی‌ها', titleEn: 'Assets', icon: 'devices', link: 'assets', roles: ['admin', 'manager', 'hr'] },
    { titleFa: 'آموزش و توسعه', titleEn: 'Learning', icon: 'school', link: 'learning' },
    { titleFa: 'هزینه‌ها و مزایا', titleEn: 'Expenses', icon: 'account_balance_wallet', link: 'expenses' },
    { titleFa: 'گزارش فعالیت‌ها', titleEn: 'Audit log', icon: 'policy', link: 'audit', roles: ['admin', 'hr'] },
    { titleFa: 'مدیریت شیفت‌ها', titleEn: 'Shifts', icon: 'calendar_month', link: 'shifts', roles: ['admin', 'manager', 'hr'] },
    { titleFa: 'تقویم سازمانی', titleEn: 'Company calendar', icon: 'event', link: 'calendar' },
    { titleFa: 'اهداف و OKR', titleEn: 'Goals & OKRs', icon: 'track_changes', link: 'goals' },
    { titleFa: 'پروفایل ۳۶۰', titleEn: 'Employee 360', icon: 'person_pin', link: 'employee-360' },
    { titleFa: 'استعداد و جانشین‌پروری', titleEn: 'Talent & succession', icon: 'workspace_premium', link: 'talent', roles: ['admin', 'manager', 'hr'] },
    { titleFa: 'نظرسنجی و eNPS', titleEn: 'Engagement & eNPS', icon: 'poll', link: 'surveys' },
    { titleFa: 'قدردانی و پاداش', titleEn: 'Recognition', icon: 'military_tech', link: 'recognition' },
    { titleFa: 'میز خدمت HR', titleEn: 'HR help desk', icon: 'support_agent', link: 'helpdesk' },
    { titleFa: 'وام و مساعده', titleEn: 'Loans & advances', icon: 'request_quote', link: 'loans' },
    { titleFa: 'مرکز تاییدها', titleEn: 'Approval center', icon: 'approval', link: 'approvals', roles: ['admin', 'manager', 'hr', 'accounting'] },
    { titleFa: 'تحلیل منابع انسانی', titleEn: 'People analytics', icon: 'query_stats', link: 'analytics', roles: ['admin', 'manager', 'hr'] },
    { titleFa: 'دستیار HR', titleEn: 'HR Assistant', icon: 'smart_toy', link: 'chat' },
    { titleFa: 'تایم‌شیت و کارکرد', titleEn: 'Timesheets', icon: 'timer', link: 'timesheets', permission: 'timesheets.view' },
    { titleFa: 'ماتریس مهارت‌ها', titleEn: 'Skills matrix', icon: 'psychology', link: 'skills-matrix', permission: 'skills.view' },
    { titleFa: 'هشدارهای چرخه کارکنان', titleEn: 'Lifecycle alerts', icon: 'notification_important', link: 'lifecycle-alerts', permission: 'lifecycle.view' },
    { titleFa: 'عملیات گروهی', titleEn: 'Bulk operations', icon: 'upload_file', link: 'bulk-operations', permission: 'bulk.manage' },
    { titleFa: 'مسیر شغلی', titleEn: 'Career paths', icon: 'route', link: 'career-path', permission: 'career.view' },
    { titleFa: 'اطلاعیه‌ها', titleEn: 'Announcements', icon: 'campaign', link: 'announcements', permission: 'announcements.view' },
    { titleFa: 'سیاست‌ها و آیین‌نامه‌ها', titleEn: 'Policies & handbook', icon: 'menu_book', link: 'policy-center', permission: 'policies.view' },
    { titleFa: 'خروج و تسویه', titleEn: 'Offboarding', icon: 'logout', link: 'offboarding-center', permission: 'offboarding.view' },
    { titleFa: 'سازنده فرم و فیلد', titleEn: 'Form & field builder', icon: 'dynamic_form', link: 'form-builder', permission: 'forms.view' },
    { titleFa: 'تایم‌لاین کارکنان', titleEn: 'Employee timeline', icon: 'history', link: 'employee-timeline', permission: 'timeline.view' },
    { titleFa: 'تمدید قراردادها', titleEn: 'Contract renewals', icon: 'event_repeat', link: 'contract-renewals', permission: 'contracts.renewals.view' },
    { titleFa: 'گواهی‌ها', titleEn: 'Certificates', icon: 'verified', link: 'certificates', permission: 'certificates.view' },
    { titleFa: 'مرکز کنترل مدیر کل', titleEn: 'Super admin', icon: 'hub', link: 'super-admin', permission: 'superadmin.view' },
    { titleFa: 'چارت سازمانی تعاملی', titleEn: 'Interactive org chart', icon: 'lan', link: 'org-chart', permission: 'orgchart.view' },
    { titleFa: 'تحویل دارایی', titleEn: 'Asset handover', icon: 'inventory_2', link: 'asset-handover', permission: 'assets.handover.view' },
    { titleFa: 'هشدارهای هوشمند', titleEn: 'Smart alerts', icon: 'crisis_alert', link: 'smart-alerts', permission: 'alerts.view' },
    { titleFa: 'برنامه‌ریز پیشرفته شیفت', titleEn: 'Advanced shift planner', icon: 'calendar_view_week', link: 'shift-planner', permission: 'shiftplanner.view' },
    { titleFa: 'گزارش‌ساز سفارشی', titleEn: 'Custom report builder', icon: 'analytics', link: 'report-builder', permission: 'reportbuilder.view' },
    { titleFa: 'پایگاه دانش HR', titleEn: 'HR knowledge base', icon: 'library_books', link: 'knowledge-base', permission: 'knowledge.view' },
    { titleFa: 'ناهنجاری حضور و غیاب', titleEn: 'Attendance anomalies', icon: 'rule', link: 'attendance-anomalies', permission: 'attendance.anomalies.view' },
    { titleFa: 'سازنده ویجت داشبورد', titleEn: 'Dashboard widgets', icon: 'widgets', link: 'dashboard-widgets', permission: 'widgets.manage' },
    { titleFa: 'سیاست مرخصی و تعطیلات', titleEn: 'Leave policy engine', icon: 'event_note', link: 'leave-policy-engine', permission: 'leave.policies.manage' },
    { titleFa: 'گاوصندوق اسناد', titleEn: 'Document vault', icon: 'folder_lock', link: 'document-vault', permission: 'vault.view' },
    { titleFa: 'مولفه‌های حقوق', titleEn: 'Payroll components', icon: 'calculate', link: 'payroll-components', permission: 'payroll.components.manage' },
    { titleFa: 'طراح KPI', titleEn: 'HR KPI designer', icon: 'speed', link: 'kpi-designer', permission: 'kpi.manage' },
    { titleFa: 'خدمات سلف‌سرویس کارکنان', titleEn: 'Employee self-service', icon: 'person_check', link: 'employee-self-service', permission: 'selfservice.view' },
    { titleFa: 'مصاحبه خروج', titleEn: 'Exit interviews', icon: 'forum', link: 'exit-interviews', permission: 'exitinterviews.view' },
    { titleFa: 'مدیریت مزایا', titleEn: 'Benefits enrollment', icon: 'health_and_safety', link: 'benefits-enrollment', permission: 'benefits.view' },
    { titleFa: 'بازنگری جبران خدمات', titleEn: 'Compensation review', icon: 'price_check', link: 'compensation-review', permission: 'compensation.view' },
    { titleFa: 'برنامه‌ریزی نیروی انسانی', titleEn: 'Workforce planning', icon: 'groups_3', link: 'workforce-planning', permission: 'workforce.view' },
    { titleFa: 'مدیریت پرونده‌های HR', titleEn: 'HR case management', icon: 'cases', link: 'hr-case-management', permission: 'cases.view' },
    { titleFa: 'باند و گرید حقوقی', titleEn: 'Salary bands & grades', icon: 'price_change', link: 'salary-bands', permission: 'salarybands.view' },
    { titleFa: 'گردش ارتقای شغلی', titleEn: 'Promotion workflow', icon: 'trending_up', link: 'promotion-workflow', permission: 'promotions.view' },
    { titleFa: 'مدیریت دوره آزمایشی', titleEn: 'Probation management', icon: 'hourglass_top', link: 'probation-management', permission: 'probation.view' },
    { titleFa: 'درخواست اسناد', titleEn: 'Document requests', icon: 'request_page', link: 'document-requests', permission: 'documentrequests.view' },
    { titleFa: 'انضباط و شکایات', titleEn: 'Disciplinary & grievance', icon: 'gavel', link: 'disciplinary-actions', permission: 'disciplinary.view' },
    { titleFa: 'مدیریت سفر', titleEn: 'Travel management', icon: 'luggage', link: 'travel-management', permission: 'travel.view' },
    { titleFa: 'کار ترکیبی و دورکاری', titleEn: 'Remote / Hybrid Work', icon: 'work_history', link: 'remote-work', permission: 'remote.view' },
    { titleFa: 'بودجه نیروی انسانی', titleEn: 'Headcount Budget', icon: 'account_balance', link: 'headcount-budget', permission: 'headcount.view' },
    { titleFa: 'تأیید و امضای دیجیتال', titleEn: 'Digital Acknowledgement', icon: 'draw', link: 'digital-acknowledgement', permission: 'acknowledgement.view' },
    { titleFa: 'صندوق اعلان پیشرفته', titleEn: 'Advanced Notification Inbox', icon: 'notifications', link: 'notification-inbox', permission: 'notifications.inbox.view' },
    { titleFa: 'اتوماسیون تقویم HR', titleEn: 'HR Calendar Automation', icon: 'event_repeat', link: 'hr-calendar-automation', permission: 'hrcalendar.view' },
    { titleFa: 'روابط کارکنان', titleEn: 'Employee Relations', icon: 'diversity_3', link: 'employee-relations', permission: 'relations.view' },
    { titleFa: 'ماتریس ریسک جانشینی', titleEn: 'Succession Risk Matrix', icon: 'grid_view', link: 'succession-risk', permission: 'successionrisk.view' },
    { titleFa: 'چرخه جبران خدمات', titleEn: 'Compensation Cycle', icon: 'paid', link: 'compensation-cycle', permission: 'compcycle.view' },
    { titleFa: 'بازار فرصت‌های شغلی داخلی', titleEn: 'Internal Job Marketplace', icon: 'work', link: 'internal-jobs', permission: 'internaljobs.view' },
    { titleFa: 'داشبورد عملیات HR', titleEn: 'HR Operations Dashboard', icon: 'monitoring', link: 'hr-operations', permission: 'hrops.view' },
    { titleFa: 'نقش‌ها و دسترسی‌ها', titleEn: 'Roles & permissions', icon: 'admin_panel_settings', link: 'access-control', permission: 'roles.manage' },
    { titleFa: 'مرکز گزارش‌ها', titleEn: 'Report center', icon: 'summarize', link: 'reports', permission: 'reports.view' },
    { titleFa: 'سازنده گردش کار', titleEn: 'Workflow builder', icon: 'account_tree', link: 'workflow-builder', permission: 'workflows.manage' },
    { titleFa: 'نماهای ذخیره‌شده', titleEn: 'Saved views', icon: 'bookmark_manager', link: 'saved-views' },
    { titleFa: 'تنظیمات اعلان‌ها', titleEn: 'Notification preferences', icon: 'notifications_active', link: 'notification-preferences' },
    { titleFa: 'تفویض اختیار', titleEn: 'Delegation', icon: 'move_up', link: 'delegation', permission: 'delegation.manage' },
    { titleFa: 'مرکز امنیت', titleEn: 'Security center', icon: 'shield_lock', link: 'security-center', permission: 'security.manage' },
    { titleFa: 'امنیت حساب‌ها', titleEn: 'Account security', icon: 'manage_accounts', link: 'account-security', permission: 'security.accounts.manage' },
    { titleFa: 'تنظیمات سازمان', titleEn: 'Organization settings', icon: 'settings', link: 'admin-settings', permission: 'settings.manage' },
  ];

  constructor(
    private router: Router,
    public notif: NotificationService,
    public auth: AuthService,
    public language: LanguageService,
    public theme: ThemeService,
    public access: AccessControlService
  ) {}

  get isFa(): boolean { return this.language.currentLanguage === 'fa'; }
  label(item: NavItem): string { return this.isFa ? item.titleFa : item.titleEn; }
  canSee(item: NavItem): boolean {
    if (item.roles && !item.roles.includes(this.userRole)) return false;
    return !item.permission || this.auth.hasPermission(item.permission) || this.access.can(item.permission);
  }
  openSearch(): void { this.searchOpen = true; }
  @HostListener('document:keydown', ['$event'])
  shortcut(event: KeyboardEvent): void { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); this.openSearch(); } }
  toggleLanguage(): void { this.language.toggle(); }
  toggleTheme(): void { this.theme.toggleTheme(); }
  toggleSidebar(): void { this.sidebarCollapsed = !this.sidebarCollapsed; }
  toggleMobile(): void { this.mobileOpen = !this.mobileOpen; }
  closeMobile(): void { this.mobileOpen = false; }
  logout(): void { this.auth.logout(); this.router.navigate(['/login']); }
}
