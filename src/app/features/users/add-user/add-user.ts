import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AddUserComponent implements OnInit {

  addUserForm!: FormGroup;

  roles = ['Admin', 'Manager', 'Employee'];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', Validators.required],
      role: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  saveUser() {
    if (this.addUserForm.invalid) return;

    console.log('کاربر جدید:', this.addUserForm.value);

    alert('کاربر با موفقیت افزوده شد ✔');

    this.router.navigate(['/users']);
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
