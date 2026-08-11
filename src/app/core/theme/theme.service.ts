import { Injectable, signal } from '@angular/core';

const THEME_STORAGE_KEY = 'fya-theme-preference';
const DARK_CLASS = 'ion-palette-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _isDark = signal(this.resolveInitialPreference());
  readonly isDark = this._isDark.asReadonly();

  constructor() {
    this.applyTheme(this._isDark());
  }

  toggle(): void {
    const next = !this._isDark();
    this._isDark.set(next);
    this.applyTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
  }

  private resolveInitialPreference(): boolean {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.classList.toggle(DARK_CLASS, isDark);
  }
}
