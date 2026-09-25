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
  currentBg = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private language: LanguageService,
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
    // اگر فرم یا کپچا معتبر نیست
    if (this.loginForm.invalid || !this.captchaOk) {
      return;
    }

    const { username, password } = this.loginForm.value;

    const success = await this.auth.login(username, password);

    if (!success) {
      alert(this.language.currentLanguage === 'fa' ? 'نام کاربری یا رمز عبور اشتباه است' : 'Incorrect username or password');
      return;
    }

    // مسیر صحیح داشبورد
    this.router.navigate(['/app/dashboard']);
  }
}
