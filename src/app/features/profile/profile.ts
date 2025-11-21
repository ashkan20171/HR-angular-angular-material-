import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  imports: [CommonModule, FormsModule]
})
export class Profile {

  // اطلاعات شخصی
  personal = {
    name: localStorage.getItem('userName') || 'کاربر',
    email: 'user@example.com',
    phone: '09120000000',
    birth: '',
    marital: 'single',
    avatar: '/assets/default-avatar.png'
  };

  // اطلاعات سازمانی
  job = {
    code: 'EMP-1024',
    position: 'کارشناس منابع انسانی',
    department: 'منابع انسانی',
    type: 'تمام وقت',
    hired: '۱۴۰۱/۰۴/۲۳',
    manager: 'سرپرست: خانم کریمی'
  };

  // تغییر رمز
  password = {
    old: '',
    new: '',
    confirm: '',
  };

  // پیش‌نمایش عکس
  avatarPreview = this.personal.avatar;

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  changePassword() {
    if (!this.password.old || !this.password.new || !this.password.confirm) {
      alert('تمام فیلدها الزامی است');
      return;
    }

    if (this.password.new !== this.password.confirm) {
      alert('رمز جدید و تکرار آن یکسان نیست');
      return;
    }

    alert('رمز عبور با موفقیت تغییر کرد');
    this.password = { old: '', new: '', confirm: '' };
  }

}
