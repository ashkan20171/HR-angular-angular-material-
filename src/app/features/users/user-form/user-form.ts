import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm {

  form!: FormGroup;
  editing = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const id = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      role: ['Employee', Validators.required]
    });

    if (id) {
      this.editing = true;
      const user = this.userService.getById(+id);
      if (user) this.form.patchValue(user);
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.editing)
      this.userService.update(this.form.value);
    else
      this.userService.create(this.form.value);

    this.router.navigate(['/users']);
  }
}
