import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/auth/auth.service';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ]
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  captchaOk = false;
  submitting = false;
  loginError = '';
  loginStage = '';
  private markStage(stage: string): void {
    this.loginStage = stage;
    try { sessionStorage.setItem('ashkanhr.login-stage', stage); } catch { /* storage unavailable */ }
  }

  currentBg = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public language: LanguageService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.setSeasonBackground();
  }

  setSeasonBackground(): void {
    const m = new Date().getMonth() + 1;

    this.currentBg =
      m >= 3 && m <= 5 ? '/assets/bg/spring.jpg' :
      m >= 6 && m <= 8 ? '/assets/bg/summer.jpg' :
      m >= 9 && m <= 11 ? '/assets/bg/autumn.jpg' :
      '/assets/bg/winter.jpg';
  }

  changeLang(lang: 'fa' | 'en'): void {
    this.language.setLanguage(lang);
  }

  onHumanVerificationChange(event: Event): void {
    this.captchaOk = (event.target as HTMLInputElement).checked;
  }

  async onSubmit(): Promise<void> {
    if (this.submitting || this.loginForm.invalid || !this.captchaOk) return;
    this.submitting = true;
    this.loginError = '';
    try {
      const { username, password } = this.loginForm.getRawValue();
      // The frontend demo authenticator is synchronous; no API request is required.
      this.markStage('checking-credentials');
      await new Promise<void>(resolve => setTimeout(resolve, 0));
      const success = this.auth.loginLocal(username, password);
      if (!success) {
        this.loginError = this.language.currentLanguage === 'fa'
          ? 'نام کاربری یا رمز عبور اشتباه است یا حساب غیرفعال شده است.'
          : 'Invalid credentials or inactive account.';
        return;
      }
      this.markStage('navigating-to-dashboard');
      // Allow the browser to paint before potentially expensive route activation.
      await new Promise<void>(resolve => setTimeout(resolve, 0));
      const navigated = await this.router.navigateByUrl('/app/dashboard');
      this.markStage(navigated ? 'dashboard-loaded' : 'navigation-failed');
      if (!navigated) {
        this.loginError = this.language.currentLanguage === 'fa'
          ? 'ورود انجام شد اما انتقال به داشبورد موفق نبود.'
          : 'Signed in, but dashboard navigation was unsuccessful.';
      }
    } catch (error) {
      console.error('Login failed', error);
      this.markStage('error');
      this.loginError = this.language.currentLanguage === 'fa'
        ? 'خطایی هنگام ورود رخ داد. لطفاً دوباره تلاش کنید.'
        : 'Something went wrong. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
