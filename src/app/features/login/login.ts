import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RecaptchaModule } from 'ng-recaptcha';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

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
    RecaptchaModule,
    TranslateModule
  ]
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  captchaOk = false;
  currentBg = '';
  currentDirection: 'rtl' | 'ltr' = 'rtl';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.setSeasonBackground();
  }

  setSeasonBackground() {
    const m = new Date().getMonth() + 1;

    this.currentBg =
      m >= 3 && m <= 5 ? '/assets/bg/spring.jpg' :
      m >= 6 && m <= 8 ? '/assets/bg/summer.jpg' :
      m >= 9 && m <= 11 ? '/assets/bg/autumn.jpg' :
      '/assets/bg/winter.jpg';
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.currentDirection = lang === 'fa' ? 'rtl' : 'ltr';
  }

  onCaptchaResolved(token: string | null) {
    this.captchaOk = !!token;
  }

  onSubmit() {
    if (this.loginForm.invalid || !this.captchaOk) return;

    localStorage.setItem('token', 'logged');
    this.router.navigate(['/dashboard']);
  }
}
