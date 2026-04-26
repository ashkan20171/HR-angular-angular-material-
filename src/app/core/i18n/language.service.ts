import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'fa' | 'en';
export type AppDirection = 'rtl' | 'ltr';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'lang';

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /** Call once at startup */
  init(): void {
    const saved = (localStorage.getItem(this.storageKey) as AppLanguage | null) ?? null;
    const lang: AppLanguage = saved === 'en' ? 'en' : 'fa';
    this.setLanguage(lang, { persist: false });
  }

  get currentLanguage(): AppLanguage {
    const lang = localStorage.getItem(this.storageKey);
    return lang === 'en' ? 'en' : 'fa';
  }

  get currentDirection(): AppDirection {
    return this.currentLanguage === 'fa' ? 'rtl' : 'ltr';
  }

  setLanguage(lang: AppLanguage, opts: { persist?: boolean } = {}): void {
    const persist = opts.persist ?? true;

    // ngx-translate
    this.translate.setDefaultLang('fa');
    this.translate.use(lang);

    // persist
    if (persist) localStorage.setItem(this.storageKey, lang);

    // direction + lang on <html>
    const dir: AppDirection = lang === 'fa' ? 'rtl' : 'ltr';
    const html = this.document.documentElement;
    html.lang = lang;
    html.dir = dir;

    // body helpers for CSS
    const body = this.document.body;
    body.classList.remove('rtl', 'ltr');
    body.classList.add(dir);
  }

  toggle(): void {
    this.setLanguage(this.currentLanguage === 'fa' ? 'en' : 'fa');
  }
}
