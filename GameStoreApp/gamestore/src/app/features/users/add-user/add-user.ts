import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser implements OnInit {

  userForm!: FormGroup;
  submitted = false;
  formSubmitted = false;

  user: User = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Email pattern that requires domain with dot (e.g., test@yahoo.com)
  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(this.emailPattern)
      ]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // Getter for easy access to form fields
  get f() { return this.userForm.controls; }

  saveUser(): void {
    this.formSubmitted = true;
    
    // Stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    const data = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };
    
    this.userService.addUser(data).subscribe({
      next: () => { 
        this.submitted = true;
        this.cdr.markForCheck();
      }
    });
  }

  newUser(): void {
    this.submitted = false;
    this.formSubmitted = false;
    this.userForm.reset();
  }
}
