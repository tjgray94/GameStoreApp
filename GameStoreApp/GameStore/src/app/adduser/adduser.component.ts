import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  userForm!: FormGroup;
  submitted = false;
  formSubmitted = false;

  user: User = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
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
      name: this.f.name.value,
      email: this.f.email.value,
      password: this.f.password.value
    };
    
    this.userService.addUser(data)
      .subscribe(response => { 
        this.submitted = true;
      });
  }

  newUser(): void {
    this.submitted = false;
    this.formSubmitted = false;
    this.userForm.reset();
  }
}
