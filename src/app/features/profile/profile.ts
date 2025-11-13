import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;

  userData = {
    name: 'اشکان رضایی',
    username: 'ashkan.rz',
    email: 'ashkan@example.com',
    mobile: '09123456789',
    role: 'Admin',
    status: 'Active',
    avatar: '/assets/avatar/default.png'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: [this.userData.name, Validators.required],
      username: [this.userData.username, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email]],
      mobile: [this.userData.mobile, Validators.required],
      role: [this.userData.role, Validators.required],
      status: [this.userData.status, Validators.required]
    });
  }

  uploadAvatar(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      this.userData.avatar = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    console.log('Updated Profile:', this.profileForm.value);

    alert('پروفایل با موفقیت ذخیره شد ✔');
  }
}
