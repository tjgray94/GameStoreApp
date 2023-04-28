import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  user: User = {
    name: '',
    email: '',
    password: ''
  };
  submitted = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  saveUser(): void {
    const data = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    };
    this.userService.addUser(data)
      .subscribe(response => { this.submitted = true })
  }

  newUser(): void {
    this.submitted = false;
    this.user = {
      name: '',
      email: '',
      password: ''
    }
  }
}
