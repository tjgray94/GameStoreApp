import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { UserService } from '../../../core/services/user-service';
import { AuthUser } from '../../../core/models/auth-user';
import { MatDialog } from '@angular/material/dialog';
import { LoginError } from '../login-error/login-error';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  public loginForm!: FormGroup;
  public email!: string;
  public password!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    this.userService.login(credentials).subscribe({
      next: (user: AuthUser) => {
        this.authService.login(user);
        this.router.navigate([`/user/home/${user.userId}`]);
      },
      error: () => {
        this.dialog.open(LoginError, {
          width: '300px',
        });
      }
    });
  }
}