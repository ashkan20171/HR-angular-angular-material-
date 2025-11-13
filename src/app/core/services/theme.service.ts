import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private themeSignal = signal<'light' | 'dark'>('light');

  constructor() {
    const saved = localStorage.getItem('theme');

    const finalTheme =
      saved === 'dark' || saved === 'light'
        ? saved
        : 'light';

    this.themeSignal.set(finalTheme);

    document.body.classList.remove('light', 'dark');
    document.body.classList.add(finalTheme);
  }

  currentTheme() {
    return this.themeSignal();
  }

  toggleTheme() {
    const newTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.themeSignal.set(newTheme);

    document.body.classList.remove('light', 'dark');
    document.body.classList.add(newTheme);

    localStorage.setItem('theme', newTheme);
  }
}
