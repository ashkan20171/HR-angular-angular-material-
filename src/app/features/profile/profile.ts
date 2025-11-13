import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../users/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  user!: User;

  constructor(private users: UserService) {
    const username = localStorage.getItem('logged_user') || 'ali';
    this.user = this.users.getAll().find(x => x.username === username)!;
  }

  edit() {
    alert('در نسخه نهایی این صفحه به ویرایش پروفایل متصل می‌شود!');
  }
}
