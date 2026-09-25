import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
export type AppLanguage='fa'|'en'; export type AppDirection='rtl'|'ltr';
@Injectable({providedIn:'root'})
export class LanguageService{
 private readonly storageKey='lang';
 private readonly _language=signal<AppLanguage>('fa');
 constructor(private translate:TranslateService,@Inject(DOCUMENT) private document:Document,@Inject(PLATFORM_ID) private platformId:Object){
   const saved=isPlatformBrowser(this.platformId)&&localStorage.getItem(this.storageKey)==='en'?'en':'fa';
   this._language.set(saved); this.apply(saved,false);
 }
 init(){this.apply(this._language(),false)}
 get currentLanguage():AppLanguage{return this._language()}
 get currentDirection():AppDirection{return this._language()==='fa'?'rtl':'ltr'}
 readonly language=this._language.asReadonly();
 setLanguage(lang:AppLanguage,opts:{persist?:boolean}={}){this._language.set(lang);this.apply(lang,opts.persist??true)}
 toggle(){this.setLanguage(this._language()==='fa'?'en':'fa')}
 private apply(lang:AppLanguage,persist:boolean){
   this.translate.setDefaultLang('fa'); this.translate.use(lang);
   if(persist&&isPlatformBrowser(this.platformId))localStorage.setItem(this.storageKey,lang);
   const dir=lang==='fa'?'rtl':'ltr'; this.document.documentElement.lang=lang; this.document.documentElement.dir=dir;
   this.document.body?.setAttribute('dir',dir); this.document.body?.classList.remove('rtl','ltr'); this.document.body?.classList.add(dir);
 }
}
