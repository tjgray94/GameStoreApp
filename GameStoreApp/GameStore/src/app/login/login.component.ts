import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { AuthUser } from '../models/auth-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  email!: string;
  password!: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router, 
              private userService: UserService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login() {
    if (this.loginForm.invalid) {
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
        alert('Invalid email or password');
      }
    });
  }
}
