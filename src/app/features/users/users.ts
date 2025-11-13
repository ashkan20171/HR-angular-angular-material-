import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, User } from './user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {

  users: User[] = [];
  search = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.users = this.userService.getAll();
  }

  filtered() {
    return this.users.filter(u =>
      u.name.includes(this.search) ||
      u.username.includes(this.search)
    );
  }

  edit(id: number) {
    this.router.navigate(['/users', id]);
  }

  add() {
    this.router.navigate(['/users/new']);
  }

  delete(id: number) {
    if (confirm('آیا حذف شود؟')) {
      this.userService.delete(id);
      this.users = this.userService.getAll();
    }
  }
}
