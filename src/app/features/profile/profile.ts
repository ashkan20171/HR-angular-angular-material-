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

  // اطلاعات کاربر
  user = {
    name: localStorage.getItem('userName') || 'کاربر سیستم',
    role: localStorage.getItem('role') || 'employee',
    email: 'user@example.com',
    phone: '09120000000',
    avatar: localStorage.getItem('avatar') || '/assets/default-avatar.png'
  };

  // آپلود عکس
  onUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.user.avatar = reader.result as string;

      // ذخیره در LocalStorage
      localStorage.setItem('avatar', this.user.avatar);
    };

    reader.readAsDataURL(file);
  }

  // ذخیره تغییرات
  save() {
    localStorage.setItem('userName', this.user.name);
    alert('تغییرات با موفقیت ذخیره شد');
  }
}
