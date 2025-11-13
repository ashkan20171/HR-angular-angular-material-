import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.html',
  styleUrl: './users.css',
  imports: [CommonModule]
})
export class UsersComponent {

  searchText = '';

  users = [
    { id: 1, name: 'اشکان رضایی', role: 'Admin', status: 'Active' },
    { id: 2, name: 'مریم یوسفی', role: 'Manager', status: 'Active' },
    { id: 3, name: 'محسن محمدی', role: 'Employee', status: 'Pending' },
    { id: 4, name: 'زهرا احمدی', role: 'Employee', status: 'Blocked' }
  ];

  get filteredUsers() {
    return this.users.filter(u =>
      u.name.includes(this.searchText) ||
      u.role.includes(this.searchText)
    );
  }

  addUser() {
    alert("صفحه افزودن کاربر بعداً ساخته می‌شود ✔");
  }

  editUser(user: any) {
    alert("ویرایش کاربر: " + user.name);
  }

  deleteUser(user: any) {
    if (confirm(`کاربر ${user.name} حذف شود؟`)) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }
}
