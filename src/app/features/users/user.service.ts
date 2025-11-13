import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  username: string;
  role: 'Admin' | 'Manager' | 'Employee';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [
    { id: 1, name: 'علی رضایی', username: 'ali', role: 'Admin', email: 'ali@test.com' },
    { id: 2, name: 'نگار احمدی', username: 'negar', role: 'Manager', email: 'negar@test.com' },
    { id: 3, name: 'مهدی محمدی', username: 'mehdi', role: 'Employee', email: 'mehdi@test.com' }
  ];

  getAll(): User[] {
    return [...this.users];
  }

  getById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(user: User) {
    user.id = Date.now();
    this.users.push(user);
  }

  update(user: User) {
    const index = this.users.findIndex(x => x.id === user.id);
    if (index >= 0) this.users[index] = user;
  }

  delete(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }
}
