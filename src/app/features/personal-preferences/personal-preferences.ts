import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { PersonalRecordsService } from '../../core/auth/personal-records.service';
@Component({selector:'app-personal-preferences',standalone:true,imports:[CommonModule,RouterLink],templateUrl:'./personal-preferences.html',styleUrl:'./personal-preferences.css'})
export class PersonalPreferences {
 language=inject(LanguageService); theme=inject(ThemeService); private records=inject(PersonalRecordsService);
 message='';
 get fa(){return this.language.currentLanguage==='fa'}
 t(fa:string,en:string){return this.fa?fa:en}
 setLanguage(lang:'fa'|'en'){this.language.setLanguage(lang);this.message=this.t('زبان تغییر کرد.','Language updated.')}
 setTheme(mode:'light'|'dark'){if(this.theme.currentTheme()!==mode)this.theme.toggleTheme();this.message=this.t('ظاهر به‌روزرسانی شد.','Appearance updated.')}
 clearFavorites(){if(this.records.write('favorite-links',[])){this.message=this.t('علاقه‌مندی‌ها پاک شدند.','Favorites cleared.'); window.dispatchEvent(new Event('ashkanhr:favorites-changed'))}else this.message=this.t('ذخیره‌سازی ممکن نیست.','Unable to save.')}
 clearShortcuts(){if(this.records.write('personal-hub-settings',[]))this.message=this.t('تنظیمات میان‌بر بازنشانی شد.','Shortcut preferences reset.');else this.message=this.t('ذخیره‌سازی ممکن نیست.','Unable to save.')}
}
