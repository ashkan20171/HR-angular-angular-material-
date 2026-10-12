import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { UserService } from '../users/user.service';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
import { AuthService } from '../../core/auth/auth.service';

/** A privacy-preserving org chart shell. Reporting lines require verified assignments. */
@Component({selector:'app-org-chart',standalone:true,imports:[CommonModule],template:`
<section class="hr-page" [attr.dir]="fa?'rtl':'ltr'">
 <header class="hr-page__hero"><div><span class="hr-eyebrow">AshkanHR · Organization</span>
 <h1>{{t('ساختار سازمانی من','My organizational profile')}}</h1>
 <p>{{t('اطلاعات سازمانی فقط پس از ثبت و تأیید رابطه استخدامی نمایش داده می‌شود.','Organization relationships appear only after employment assignments are verified.')}}</p></div></header>
 <article class="hr-panel"><div class="hr-panel__body">
 <div class="org-grid"><article class="hr-card"><span class="material-symbols-rounded">account_circle</span>
 <strong>{{displayName}}</strong><small>{{t('حساب کاربری فعلی','Current account')}}</small>
 <span>{{t('نقش سیستم: ','System role: ')}}{{role}}</span></article></div>
 <div class="org-disclaimer" role="status">{{t('مدیر مستقیم، واحد سازمانی و اعضای تیم هنوز برای این حساب تأیید نشده‌اند. اطلاعات دیگر کارکنان نمایش داده نمی‌شود.','Manager, department and team members are not yet verified for this account. Other employees are not displayed.')}}</div>
 </div></article>
</section>` ,styles:[`.org-disclaimer{margin-top:1rem;padding:1rem;border-radius:12px;border:1px solid var(--border,#cbd5e1);line-height:1.9;color:var(--text-secondary,#64748b)}`]})
export class OrgChart {
 private lang=inject(LanguageService);
 private users=inject(UserService);
 private records=inject(PersonalRecordsService);
 private auth=inject(AuthService);
 get fa(){return this.lang.currentLanguage==='fa'}
 t(fa:string,en:string){return this.fa?fa:en}
 get displayName(){const id=Number(this.records.ownerId);return Number.isSafeInteger(id)&&id>0?(this.users.getById(id)?.name||this.t('کاربر','User')):this.t('کاربر','User')}
 get role(){return this.auth.role}
}
