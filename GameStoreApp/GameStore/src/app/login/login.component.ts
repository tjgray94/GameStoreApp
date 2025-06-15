import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  email!: string;
  password!: string;
  users!: User[];

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

  retrieveUsers(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    })
  }

  login() {
    this.userService.getAllUsers().subscribe(users => {
      const user = users.find(u => u.email === this.loginForm.value.email && u.password === this.loginForm.value.password);
      
      if (user) {
        // User authenticated successfully
        console.log('Login successful for user:', user);
        // Update auth state
        this.authService.login(user);
        // Navigate to user home with userId
        this.router.navigate([`/user/home/${user.userId}`]);
      } else {
        // Authentication failed
        console.log('Invalid credentials');
        alert('Invalid email or password');
      }
    });
  }
}
