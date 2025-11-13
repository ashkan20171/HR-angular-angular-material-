import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class EditUserComponent implements OnInit {

  editUserForm!: FormGroup;
  userId!: number;

  roles = ['Admin', 'Manager', 'Employee'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.editUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', Validators.required],
      role: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.loadUserData(this.userId);
  }

  loadUserData(id: number) {
    // این قسمت بعداً به API واقعی وصل می‌شود
    // فعلاً Mock Data
    const mockUser = {
      id: id,
      name: 'اشکان رضایی',
      username: 'ashkan.rz',
      role: 'Admin',
      status: 'Active'
    };

    this.editUserForm.patchValue(mockUser);
  }

  saveChanges() {
    if (this.editUserForm.invalid) return;

    console.log('ویرایش کاربر:', this.editUserForm.value);

    alert('کاربر با موفقیت ویرایش شد ✔');

    this.router.navigate(['/users']);
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
