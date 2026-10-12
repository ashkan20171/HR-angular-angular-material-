import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../users/user.service';
import { PersonalProfileService } from '../../core/auth/personal-profile.service';
import { EmploymentProfileService } from '../../core/auth/employment-profile.service';
import { LocaleDatePipe } from '../../shared/locale-date.pipe';
import { LanguageService } from '../../core/i18n/language.service';

@Component({selector:'app-profile',standalone:true,templateUrl:'./profile.html',styleUrl:'./profile.css',imports:[LocaleDatePipe,CommonModule,FormsModule]})
export class Profile {
 private platformId=inject(PLATFORM_ID);
 private users=inject(UserService);
 lang=inject(LanguageService);
 private employment=inject(EmploymentProfileService);
 private personal=inject(PersonalProfileService);
 personalForm={phone:'',city:'',emergencyContact:'',emergencyPhone:''};
 personalMessage=''; personalError=false;
 constructor(){const saved=this.personal.current;if(saved)this.personalForm={phone:saved.phone,city:saved.city,emergencyContact:saved.emergencyContact,emergencyPhone:saved.emergencyPhone};}
 savePersonal(){this.personalError=!this.personal.save(this.personalForm);this.personalMessage=this.personalError?(this.fa?'شماره تماس نامعتبر است یا ذخیره‌سازی ممکن نیست.':'Invalid phone number or unable to save.'):(this.fa?'پیش‌نویس شخصی ذخیره شد.':'Personal draft saved.');}

 get employmentDraft(){return this.employment.current;}
 get fa(){return this.lang.currentLanguage==='fa'}
 private get storedUserId(): string | null {
   if (!isPlatformBrowser(this.platformId)) return null;
   try { return localStorage.getItem('userId'); } catch { return null; }
 }
 get user():User|undefined {
   const rawId = this.storedUserId;
   const id = rawId ? Number(rawId) : NaN;
   return Number.isSafeInteger(id)&&id>0 ? this.users.getById(id) : undefined;
 }
 get displayName(){return this.user?.name || this.user?.username || (this.fa?'کاربر':'User')}
 get email(){return this.user?.email || '—'}
 get username(){return this.user?.username || '—'}
 get role(){return this.user?.role || '—'}
 get accountId(){return this.user?.id || '—'}
 // Profile information is read from the currently authenticated user's record.
 // Employment fields have not been connected to real per-user data yet.
}
