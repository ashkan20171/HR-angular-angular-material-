import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
@Injectable({providedIn:'root'})
export class ThemeService{
 private themeSignal=signal<'light'|'dark'>('light');
 constructor(@Inject(DOCUMENT) private document:Document,@Inject(PLATFORM_ID) private platformId:Object){if(isPlatformBrowser(this.platformId)){let saved: string | null = null;try{saved=localStorage.getItem('theme')}catch{}const finalTheme:savedTheme=saved==='dark'?'dark':'light';this.apply(finalTheme)}}
 currentTheme(){return this.themeSignal()}
 toggleTheme(){const next=this.themeSignal()==='light'?'dark':'light';this.apply(next);if(isPlatformBrowser(this.platformId)){try{localStorage.setItem('theme',next)}catch{}}}
 private apply(theme:'light'|'dark'){this.themeSignal.set(theme);this.document.body.classList.remove('light','dark');this.document.body.classList.add(theme)}
}
type savedTheme='light'|'dark';
